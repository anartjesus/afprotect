import { githubConfig, githubRequest, requireAuth } from "./_auth.js";

const CONTENT_PATH = "public/content.json";

export default async function handler(request, response) {
  if (!requireAuth(request, response)) return;
  if (!["GET", "PUT"].includes(request.method)) return response.status(405).json({ error: "Método não permitido." });

  try {
    const { branch } = githubConfig();
    const currentResponse = await githubRequest(`/contents/${CONTENT_PATH}?ref=${encodeURIComponent(branch)}`);
    const current = await currentResponse.json();
    if (!currentResponse.ok) throw new Error(current.message || "Não foi possível ler os conteúdos.");

    if (request.method === "GET") {
      const content = JSON.parse(Buffer.from(current.content, "base64").toString("utf8"));
      return response.status(200).json({ content, sha: current.sha });
    }

    const content = request.body?.content;
    if (!content || typeof content !== "object") return response.status(400).json({ error: "Conteúdo inválido." });
    const currentContent = JSON.parse(Buffer.from(current.content, "base64").toString("utf8"));
    const safeContent = {
      ...currentContent,
      clients: Array.isArray(content.clients) ? content.clients : currentContent.clients,
      contact: content.contact && typeof content.contact === "object" ? content.contact : currentContent.contact,
      products: currentContent.products.map((product, index) => ({
        ...product,
        image: content.products?.[index]?.image || product.image,
      })),
    };
    const saveResponse = await githubRequest(`/contents/${CONTENT_PATH}`, {
      method: "PUT",
      body: JSON.stringify({
        message: "Atualizar conteúdos através do backoffice",
        content: Buffer.from(`${JSON.stringify(safeContent, null, 2)}\n`).toString("base64"),
        sha: current.sha,
        branch,
      }),
    });
    const result = await saveResponse.json();
    if (!saveResponse.ok) throw new Error(result.message || "Não foi possível guardar os conteúdos.");
    return response.status(200).json({ ok: true, sha: result.content?.sha });
  } catch (error) {
    console.error("Admin content error:", error.message);
    return response.status(500).json({ error: error.message });
  }
}
