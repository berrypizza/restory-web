import { createClient } from "npm:@supabase/supabase-js@2.105.4";
import { activationHandler } from "./handler.mjs";

const url = Deno.env.get("SUPABASE_URL")!;
const auth = { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false };
Deno.serve(activationHandler({
  admin: createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth }),
  passwordClient: () => createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { auth }),
  site: "https://www.restorystudio.co.kr",
}));
