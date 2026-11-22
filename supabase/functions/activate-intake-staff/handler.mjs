// The setup credential authorizes initial enrollment only. Existing passwords are never overwritten.
export function activationHandler({ admin, passwordClient, site }) {
  return async request => {
    const headers = {
      "Cache-Control": "no-store", "Content-Type": "application/json",
      "Access-Control-Allow-Origin": site, "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    };
    const reply = (status, data) => new Response(data ? JSON.stringify(data) : null, { status, headers });
    if (request.method === "OPTIONS") return reply(204);
    if (request.method !== "POST") return reply(405);
    if (Number(request.headers.get("content-length")) > 1800) return reply(413);
    try {
      const raw = await request.text();
      if (raw.length > 1800) return reply(413);
      const { ticket, password } = JSON.parse(raw);
      if (typeof ticket !== "string" || !/^[0-9a-f]{64}$/.test(ticket) ||
          typeof password !== "string" || password.length < 8 || new TextEncoder().encode(password).length > 72) return reply(400);
      const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ticket));
      const digest = Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2,"0")).join("");
      const { data: invite, error: readError } = await admin.from("intake_setup_tickets")
        .select("login_id,auth_email").eq("token_digest", digest).gt("expires_at", new Date().toISOString()).is("used_at", null).maybeSingle();
      if (readError) return reply(503);
      if (!invite) return reply(410);
      const { data, error } = await admin.auth.admin.createUser({
        email: invite.auth_email, password, email_confirm: true, app_metadata: { restory_staff_login: invite.login_id },
      });
      let user = data.user;
      if (error) {
        if (!["email_exists", "user_already_exists"].includes(error.code)) return reply(error.status >= 500 ? 503 : 422);
        // A previous attempt can create the account before the membership transaction returns.
        const check = await passwordClient().auth.signInWithPassword({ email: invite.auth_email, password });
        if (check.error) return reply(409);
        user = check.data.user;
      }
      if (!user || user.email !== invite.auth_email || user.app_metadata?.restory_staff_login !== invite.login_id) return reply(409);
      const bound = await admin.rpc("complete_intake_enrollment", { p_digest: digest, p_user: user.id });
      if (bound.error) return reply(503);
      if (!bound.data) return reply(410);
      return reply(200, { login: invite.login_id });
    } catch (error) { return reply(error instanceof SyntaxError ? 400 : 503); }
  };
}
