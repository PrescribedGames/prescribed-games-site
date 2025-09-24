import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();

    // Honeypot
    if ((form.get("website") as string)?.trim()) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const message = String(form.get("message") || "");

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ ok: false, hint: "Missing fields." }), { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO = process.env.TO_EMAIL;
    const FROM = process.env.FROM_EMAIL || "onboarding@resend.dev";

    if (!RESEND_API_KEY || !TO) {
      return new Response(
        JSON.stringify({
          ok: false,
          hint: "Email service not configured yet. Set RESEND_API_KEY, TO_EMAIL, FROM_EMAIL in Vercel.",
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: [email],
        subject: `New enquiry from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`
      })
    });

    if (!res.ok) {
      const t = await res.text();
      return new Response(JSON.stringify({ ok: false, hint: `Send failed: ${t}` }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, hint: e?.message || "Unknown error" }), { status: 500 });
  }
};
