import { githubConfig, githubRequest } from "./admin/_auth.js";

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).json({ error: "Método não permitido." });
  try {
    const { branch } = githubConfig();
    const githubResponse = await githubRequest(`/contents/public/content.json?ref=${encodeURIComponent(branch)}`);
    const result = await githubResponse.json();
    if (!githubResponse.ok) throw new Error(result.message || "Não foi possível carregar os conteúdos.");
    const content = JSON.parse(Buffer.from(result.content, "base64").toString("utf8"));
    response.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=300");
    return response.status(200).json(content);
  } catch (error) {
    console.error("Public content error:", error.message);
    return response.status(500).json({ error: "Conteúdos temporariamente indisponíveis." });
  }
}
