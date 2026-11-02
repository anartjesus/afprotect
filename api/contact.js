const json = (response, status, body) => response.status(status).json(body);

const clean = (value, max = 2000) => String(value || "").trim().slice(0, max);
const escapeHtml = (value) => clean(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

export default async function handler(request, response) {
  if (request.method !== "POST") return json(response, 405, { error: "Método não permitido." });

  const { name, email, phone, message, context, website } = request.body || {};
  if (website) return json(response, 200, { ok: true });
  if (!clean(name, 120) || !/^\S+@\S+\.\S+$/.test(clean(email, 180)) || !clean(message, 3000)) {
    return json(response, 400, { error: "Preencha o nome, um e-mail válido e a mensagem." });
  }
  if (!process.env.RESEND_API_KEY) {
    return json(response, 503, { error: "O envio ainda não está configurado. Contacte-nos através de geral.afprotect@gmail.com." });
  }

  const subject = clean(context, 160) || "Pedido de informação";
  const to = process.env.CONTACT_TO_EMAIL || "geral.afprotect@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || "AFPROTECT <pedidos@afprotect.pt>";
  const body = {
    from,
    to: [to],
    reply_to: clean(email, 180),
    subject: `${subject} — ${clean(name, 120)}`,
    html: `
      <h2>${escapeHtml(subject)}</h2>
      <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
      <p><strong>Telefone:</strong> ${escapeHtml(phone) || "Não indicado"}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  };

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok) throw new Error(result.message || "Falha no serviço de envio.");
    return json(response, 200, { ok: true, id: result.id });
  } catch (error) {
    console.error("Contact form error:", error.message);
    return json(response, 502, { error: "Não foi possível enviar agora. Tente novamente dentro de alguns minutos." });
  }
}
