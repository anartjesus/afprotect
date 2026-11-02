import { ArrowDown, ArrowUpRight } from "lucide-react";
import { openContactForm } from "../content";

export default function Hero({ content }) {
  return (
    <section id="inicio" className="hero">
      <div className="hero__rail"><span>01</span><span>AFPROTECT / DESDE 2015</span></div>
      <div className="hero__content wrap">
        <p className="hero__eyebrow">{content?.eyebrow || "Extintores · Alarmes · Videovigilância"}</p>
        <h1><span>{content?.title || "Preparados"}</span><em>{content?.highlight || "para proteger."}</em></h1>
        <div className="hero__bottom">
          <p>{content?.description || "Extintores, alarmes e câmaras de videovigilância, com instalação, manutenção e acompanhamento técnico desde 2015."}</p>
          <div className="hero__actions">
            <button className="button button--primary" type="button" onClick={() => openContactForm("Pedido de orçamento")}>Pedir orçamento <ArrowUpRight /></button>
            <a className="button button--secondary" href="#servicos">Conhecer serviços</a>
          </div>
        </div>
      </div>
      <figure className="hero__image">
        <picture>
          <source media="(max-width: 640px)" srcSet={content?.mobileImage || "/images/heromobile-afprotect.jpg"} />
          <img src={content?.desktopImage || "/images/hero-afprotect.jpg"} alt="Instalações e viatura de assistência técnica da AFPROTECT" />
        </picture>
        <figcaption>{content?.caption || "Manutenção técnica / AFPROTECT"}</figcaption>
      </figure>
      <a href="#empresa" className="hero__scroll" aria-label="Descer para a secção Empresa"><ArrowDown /></a>
    </section>
  );
}
