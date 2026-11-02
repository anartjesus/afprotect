import { clearSessionCookie } from "./_auth.js";

export default function handler(request, response) {
  if (request.method !== "POST") return response.status(405).json({ error: "Método não permitido." });
  response.setHeader("Set-Cookie", clearSessionCookie());
  return response.status(200).json({ ok: true });
}
