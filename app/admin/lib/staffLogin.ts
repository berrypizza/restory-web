import accounts from "@/lib/intake-staff.json";
import { getSupabase } from "./utils";

export async function signInStaff(login: string, password: string) {
  const id = login.trim().normalize("NFC").toLowerCase();
  const account = accounts.find(entry => entry.login === id);
  if (!account) return false;
  const { error } = await getSupabase().auth.signInWithPassword({ email: account.authEmail, password });
  return !error;
}
