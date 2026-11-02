import { useEffect, useState } from "react";
import { Check, LogOut, Save, Upload } from "lucide-react";
import "./admin.css";

const sections = [
  ["hero", "Hero"], ["about", "Sobre nós"], ["services", "Serviços"],
  ["products", "Equipamentos"], ["clients", "Clientes"], ["contact", "Contactos"],
];

const clone = (value) => JSON.parse(JSON.stringify(value));

function Field({ label, value, onChange, multiline = false, type = "text" }) {
  return <label className="admin-field"><span>{label}</span>{multiline
    ? <textarea rows="3" value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
    : <input type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function ImageField({ label, value, onChange, upload }) {
  return <div className="admin-image-field">
    <Field label={label} value={value} onChange={onChange} />
    <label className="admin-upload"><Upload /> Substituir imagem<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => upload(event.target.files?.[0], onChange)} /></label>
    {value && <img src={value} alt="Pré-visualização" />}
  </div>;
}

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState(null);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState(null);
  const [active, setActive] = useState("hero");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const loadContent = async () => {
    const response = await fetch("/api/admin/content", { cache: "no-store" });
    if (response.status === 401) { setAuthenticated(false); return; }
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Não foi possível carregar os conteúdos.");
    setContent(result.content);
    setAuthenticated(true);
  };

  // A sessão e o conteúdo existem fora do React e precisam de ser verificados ao abrir o backoffice.
  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => { loadContent().catch((error) => { setAuthenticated(false); setMessage(error.message); }); }, []);

  const login = async (event) => {
    event.preventDefault(); setStatus("saving"); setMessage("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível iniciar sessão.");
      setPassword(""); await loadContent();
    } catch (error) { setMessage(error.message); } finally { setStatus("idle"); }
  };

  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); setAuthenticated(false); setContent(null); };
  const changeObject = (section, key, value) => setContent((current) => ({ ...current, [section]: { ...current[section], [key]: value } }));
  const changeListItem = (section, index, key, value) => setContent((current) => {
    const next = clone(current); next[section][index][key] = value; return next;
  });

  const upload = async (file, onChange) => {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { setMessage("A imagem deve ter menos de 3 MB."); return; }
    setStatus("uploading"); setMessage("");
    try {
      const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
      const response = await fetch("/api/admin/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: file.name, data }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível carregar a imagem.");
      onChange(result.path); setMessage("Imagem carregada. Clique em Guardar alterações para a aplicar.");
    } catch (error) { setMessage(error.message); } finally { setStatus("idle"); }
  };

  const save = async () => {
    setStatus("saving"); setMessage("");
    try {
      const response = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível guardar.");
      setStatus("saved"); setMessage("Alterações guardadas. Poderão demorar até cerca de 30 segundos a aparecer no site.");
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch (error) { setStatus("idle"); setMessage(error.message); }
  };

  if (authenticated === null) return <main className="admin-loading">A carregar…</main>;
  if (!authenticated) return <main className="admin-login"><form onSubmit={login}><img src="/images/logo-afprotect.png" alt="AFPROTECT" /><p>Backoffice</p><h1>Gestão do site</h1><Field label="Palavra-passe" type="password" value={password} onChange={setPassword} />{message && <div className="admin-message admin-message--error">{message}</div>}<button disabled={status === "saving"}>{status === "saving" ? "A entrar…" : "Entrar"}</button><a href="/">← Voltar ao site</a></form></main>;
  if (!content) return <main className="admin-loading">A carregar conteúdos…</main>;

  return <div className="admin-shell">
    <header className="admin-header"><a href="/"><img src="/images/logo-afprotect.png" alt="AFPROTECT" /></a><div><span>Backoffice</span><button type="button" onClick={logout}><LogOut /> Terminar sessão</button></div></header>
    <aside className="admin-nav"><p>Conteúdos</p>{sections.map(([id, label]) => <button key={id} type="button" className={active === id ? "is-active" : ""} onClick={() => setActive(id)}>{label}</button>)}</aside>
    <main className="admin-main">
      <div className="admin-title"><div><small>Editar conteúdos</small><h1>{sections.find(([id]) => id === active)?.[1]}</h1></div><button className="admin-save" type="button" onClick={save} disabled={status === "saving" || status === "uploading"}>{status === "saved" ? <><Check /> Guardado</> : <><Save /> {status === "saving" ? "A guardar…" : "Guardar alterações"}</>}</button></div>
      {message && <div className={`admin-message ${message.startsWith("Alterações") || message.startsWith("Imagem") ? "" : "admin-message--error"}`}>{message}</div>}

      {active === "hero" && <section className="admin-panel"><Field label="Texto superior" value={content.hero.eyebrow} onChange={(value) => changeObject("hero", "eyebrow", value)} /><Field label="Título" value={content.hero.title} onChange={(value) => changeObject("hero", "title", value)} /><Field label="Destaque a vermelho" value={content.hero.highlight} onChange={(value) => changeObject("hero", "highlight", value)} /><Field label="Descrição" multiline value={content.hero.description} onChange={(value) => changeObject("hero", "description", value)} /><ImageField label="Imagem desktop" value={content.hero.desktopImage} onChange={(value) => changeObject("hero", "desktopImage", value)} upload={upload} /><ImageField label="Imagem mobile" value={content.hero.mobileImage} onChange={(value) => changeObject("hero", "mobileImage", value)} upload={upload} /><Field label="Legenda da imagem" value={content.hero.caption} onChange={(value) => changeObject("hero", "caption", value)} /></section>}

      {active === "about" && <section className="admin-panel"><Field label="Título" value={content.about.title} onChange={(value) => changeObject("about", "title", value)} /><Field label="Destaque a vermelho" value={content.about.highlight} onChange={(value) => changeObject("about", "highlight", value)} /><Field label="Frase de abertura" multiline value={content.about.lead} onChange={(value) => changeObject("about", "lead", value)} />{content.about.paragraphs.map((paragraph, index) => <Field key={index} label={`Parágrafo ${index + 1}`} multiline value={paragraph} onChange={(value) => { const paragraphs = [...content.about.paragraphs]; paragraphs[index] = value; changeObject("about", "paragraphs", paragraphs); }} />)}<h2>Dados em destaque</h2>{content.about.facts.map((fact, index) => <div className="admin-row" key={index}><Field label="Valor" value={fact.value} onChange={(value) => { const facts = clone(content.about.facts); facts[index].value = value; changeObject("about", "facts", facts); }} /><Field label="Descrição" value={fact.label} onChange={(value) => { const facts = clone(content.about.facts); facts[index].label = value; changeObject("about", "facts", facts); }} /></div>)}</section>}

      {active === "services" && <section className="admin-list">{content.services.map((item, index) => <article key={index}><div className="admin-item-title"><span>{item.number}</span><h2>{item.title}</h2></div><div className="admin-row"><Field label="Nome" value={item.title} onChange={(value) => changeListItem("services", index, "title", value)} /><Field label="Descrição" value={item.description} onChange={(value) => changeListItem("services", index, "description", value)} /></div><label className="admin-check"><input type="checkbox" checked={item.featured} onChange={(event) => changeListItem("services", index, "featured", event.target.checked)} /> Mostrar como serviço em destaque</label></article>)}</section>}

      {active === "products" && <section className="admin-list">{content.products.map((item, index) => <article key={index}><div className="admin-item-title"><span>{item.number}</span><h2>{item.name}</h2></div><div className="admin-row"><Field label="Nome" value={item.name} onChange={(value) => changeListItem("products", index, "name", value)} /><Field label="Descrição" value={item.description} onChange={(value) => changeListItem("products", index, "description", value)} /></div><ImageField label="Imagem" value={item.image} onChange={(value) => changeListItem("products", index, "image", value)} upload={upload} /></article>)}</section>}

      {active === "clients" && <section className="admin-list admin-list--clients">{content.clients.map((item, index) => <article key={index}><div className="admin-item-title"><span>{String(index + 1).padStart(2, "0")}</span><h2>{item.name}</h2></div><Field label="Nome" value={item.name} onChange={(value) => changeListItem("clients", index, "name", value)} /><ImageField label="Logótipo" value={item.logo} onChange={(value) => changeListItem("clients", index, "logo", value)} upload={upload} /></article>)}</section>}

      {active === "contact" && <section className="admin-panel"><Field label="E-mail público" type="email" value={content.contact.email} onChange={(value) => changeObject("contact", "email", value)} />{content.contact.phones.map((phone, index) => <Field key={index} label={`Telefone ${index + 1}`} value={phone} onChange={(value) => { const phones = [...content.contact.phones]; phones[index] = value; changeObject("contact", "phones", phones); }} />)}<Field label="Morada" multiline value={content.contact.address} onChange={(value) => changeObject("contact", "address", value)} /><Field label="Ligação Google Maps" value={content.contact.mapsUrl} onChange={(value) => changeObject("contact", "mapsUrl", value)} /><Field label="Horário" multiline value={content.contact.schedule} onChange={(value) => changeObject("contact", "schedule", value)} /></section>}
    </main>
  </div>;
}
