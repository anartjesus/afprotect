import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [["Início", "#inicio"], ["Sobre Nós", "#empresa"], ["Serviços", "#servicos"], ["Produtos", "#produtos"], ["Área Técnica", "#certificacoes"], ["Clientes", "#clientes"], ["Contactos", "#contactos"]];

export default function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  return <header className="header">
    <a href="#inicio" className="header__logo" aria-label="AFPROTECT — Início"><img src="/images/logo-afprotect.png" alt="AFPROTECT" /></a>
    <nav className="header__nav" aria-label="Navegação principal">{links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav>
    <a className="header__cta" href="mailto:geral.afprotect@gmail.com?subject=Pedido%20de%20or%C3%A7amento">Pedir orçamento <ArrowUpRight /></a>
    <button className="header__toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X /> : <Menu />}</button>
    <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <span>Menu / AFPROTECT</span>{links.map(([label, href], i) => <a key={href} href={href} onClick={() => setOpen(false)}><small>0{i + 1}</small>{label}</a>)}
      <a href="mailto:geral.afprotect@gmail.com?subject=Pedido%20de%20or%C3%A7amento">Pedir orçamento <ArrowUpRight /></a>
    </div>
  </header>;
}
