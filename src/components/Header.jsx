import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { openContactEmail } from "../content";

const links = [["Empresa", "#empresa"], ["Serviços", "#servicos"], ["Produtos", "#produtos"], ["Área Técnica", "#certificacoes"], ["Contactos", "#contactos"]];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#inicio");

  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  useEffect(() => {
    const updateActiveLink = () => {
      const marker = window.scrollY + 120 + window.innerHeight * 0.2;
      let current = "#inicio";

      links.forEach(([, href]) => {
        const section = document.querySelector(href);
        if (section && section.offsetTop <= marker) current = href;
      });

      setActiveHref(current);
    };

    const syncFromHash = () => {
      const hash = window.location.hash;
      if (links.some(([, href]) => href === hash)) setActiveHref(hash);
    };

    syncFromHash();
    const initialFrame = window.requestAnimationFrame(updateActiveLink);
    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("resize", updateActiveLink);
    window.addEventListener("hashchange", syncFromHash);
    return () => {
      window.cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", updateActiveLink);
      window.removeEventListener("resize", updateActiveLink);
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  return <header className="header">
    <a href="#inicio" className="header__logo" aria-label="AFPROTECT — Início" onClick={() => setActiveHref("#inicio")}><img src="/images/logo-afprotect.png" alt="AFPROTECT" /></a>
    <nav className="header__nav" aria-label="Navegação principal">{links.map(([label, href]) => <a key={href} href={href} className={activeHref === href ? "is-active" : undefined} aria-current={activeHref === href ? "page" : undefined} onClick={() => setActiveHref(href)}>{label}</a>)}</nav>
    <button className="header__cta" type="button" onClick={() => openContactEmail("Pedido de orçamento")}>Pedir orçamento <ArrowUpRight /></button>
    <button className="header__toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X /> : <Menu />}</button>
    <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <span>Menu / AFPROTECT</span>{links.map(([label, href], i) => <a key={href} href={href} className={activeHref === href ? "is-active" : undefined} aria-current={activeHref === href ? "page" : undefined} onClick={() => { setActiveHref(href); setOpen(false); }}><small>0{i + 1}</small>{label}</a>)}
      <button type="button" onClick={() => { setOpen(false); openContactEmail("Pedido de orçamento"); }}>Pedir orçamento <ArrowUpRight /></button>
    </div>
  </header>;
}
