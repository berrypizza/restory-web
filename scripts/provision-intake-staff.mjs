// Creates a one-use setup link for one named staff member. No email is sent.
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are supplied by the operator's environment.
// node scripts/provision-intake-staff.mjs <staff-login> <private-output-file> [site-origin]
import { readFile, open, unlink } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const [login, output, origin = "https://www.restorystudio.co.kr"] = process.argv.slice(2);
const accounts = JSON.parse(await readFile(new URL("../lib/intake-staff.json", import.meta.url), "utf8"));
const account = accounts.find(entry => entry.login === login?.normalize("NFC").toLowerCase());
if (!account || !output) throw new Error("직원 아이디와 새 설정 링크 파일의 경로를 입력해 주세요.");
const target = new URL("/admin/intake/activate", origin);
if (target.protocol !== "https:" && !["127.0.0.1", "localhost"].includes(target.hostname)) throw new Error("HTTPS 사이트 주소가 필요합니다.");
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
const file = await open(output, "wx", 0o600);
let saved = false;
try {
  const { data: member, error: readError } = await db.from("intake_staff").select("user_id,role").eq("staff_name", account.name).maybeSingle();
  if (readError) throw readError;
  if (!member) {
    const { error } = await db.auth.admin.createUser({ email: account.authEmail, email_confirm: true,
      password: randomBytes(32).toString("base64url"), app_metadata: { restory_staff_login: account.login } });
    if (error && !["email_exists", "user_already_exists"].includes(error.code)) throw error;
  }
  const { data, error } = await db.auth.admin.generateLink({ type: "recovery", email: account.authEmail });
  if (error) throw error;
  if (data.user.email !== account.authEmail || data.user.app_metadata?.restory_staff_login !== account.login ||
    (member && (member.user_id !== data.user.id || member.role !== account.role))) {
    throw new Error("기존 계정의 직원 정보와 일치하지 않습니다.");
  }
  if (!member) {
    const { error } = await db.from("intake_staff").insert({ user_id: data.user.id, staff_name: account.name, role: account.role });
    if (error) throw error;
  }
  target.hash = new URLSearchParams({ setup: data.properties.hashed_token }).toString();
  await file.writeFile(`${account.name} · 직원 아이디 ${account.login}\n${target.href}\n`);
  saved = true;
  console.log("직원용 일회성 설정 링크를 지정한 파일에 저장했습니다.");
} finally {
  await file.close();
  if (!saved) await unlink(output);
}
