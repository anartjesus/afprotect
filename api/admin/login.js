import { createSessionCookie, isAuthenticated, passwordsMatch } from "./_auth.js";

export default function handler(request, response) {
  if (request.method === "GET") return response.status(200).json({ authenticated: isAuthenticated(request) });
  if (request.method !== "POST") return response.status(405).json({ error: "Método não permitido." });
  if (!passwordsMatch(request.body?.password)) return response.status(401).json({ error: "Palavra-passe incorreta." });
  response.setHeader("Set-Cookie", createSessionCookie());
  return response.status(200).json({ authenticated: true });
}
