import { githubConfig, githubRequest, requireAuth } from "./_auth.js";

export const config = { api: { bodyParser: { sizeLimit: "4mb" } } };

const safeName = (name) => String(name || "imagem").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();

export default async function handler(request, response) {
  if (!requireAuth(request, response)) return;
  if (request.method !== "POST") return response.status(405).json({ error: "Método não permitido." });
  const { name, data } = request.body || {};
  const match = String(data || "").match(/^data:image\/(png|jpeg|webp);base64,(.+)$/);
  if (!match) return response.status(400).json({ error: "Escolha uma imagem PNG, JPG ou WEBP válida." });

  const extension = match[1] === "jpeg" ? "jpg" : match[1];
  const filename = `${Date.now()}-${safeName(name).replace(/\.[^.]+$/, "")}.${extension}`;
  const path = `public/images/uploads/${filename}`;
  try {
    const { branch } = githubConfig();
    const uploadResponse = await githubRequest(`/contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({ message: `Adicionar imagem ${filename}`, content: match[2], branch }),
    });
    const result = await uploadResponse.json();
    if (!uploadResponse.ok) throw new Error(result.message || "Não foi possível carregar a imagem.");
    return response.status(200).json({ ok: true, path: `/images/uploads/${filename}` });
  } catch (error) {
    console.error("Admin upload error:", error.message);
    return response.status(500).json({ error: error.message });
  }
}
