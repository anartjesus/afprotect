import crypto from "node:crypto";

const COOKIE_NAME = "afprotect_admin";
const MAX_AGE = 60 * 60 * 8;

const encode = (value) => Buffer.from(value).toString("base64url");
const sign = (value) => crypto.createHmac("sha256", process.env.SESSION_SECRET || "").update(value).digest("base64url");

export function createSessionCookie() {
  const payload = encode(JSON.stringify({ expires: Date.now() + MAX_AGE * 1000 }));
  return `${COOKIE_NAME}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function isAuthenticated(request) {
  if (!process.env.SESSION_SECRET) return false;
  const raw = String(request.headers.cookie || "").split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!raw) return false;
  const [payload, signature] = raw.slice(COOKIE_NAME.length + 1).split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try { return JSON.parse(Buffer.from(payload, "base64url").toString()).expires > Date.now(); } catch { return false; }
}

export function passwordsMatch(value) {
  const expected = process.env.ADMIN_PASSWORD || "";
  const received = String(value || "");
  if (!expected || expected.length !== received.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export function requireAuth(request, response) {
  if (isAuthenticated(request)) return true;
  response.status(401).json({ error: "Sessão inválida ou expirada." });
  return false;
}

export function githubConfig() {
  const repo = process.env.GITHUB_REPO || "anartjesus/afprotect";
  return { repo, token: process.env.GITHUB_TOKEN, branch: process.env.GITHUB_BRANCH || "main" };
}

export async function githubRequest(path, options = {}) {
  const { repo, token } = githubConfig();
  if (!token) throw new Error("GITHUB_TOKEN não configurado.");
  return fetch(`https://api.github.com/repos/${repo}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}
