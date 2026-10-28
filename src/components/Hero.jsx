import { ArrowDown, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero__rail"><span>01</span><span>AFPROTECT / DESDE 2015</span></div>
      <div className="hero__content wrap">
        <p className="hero__eyebrow">Extintores · Alarmes · Videovigilância</p>
        <h1><span>Preparados</span><em>para proteger.</em></h1>
        <div className="hero__bottom">
          <p>Extintores, alarmes e câmaras de videovigilância, com instalação, manutenção e acompanhamento técnico desde 2015.</p>
          <div className="hero__actions">
            <a className="button button--primary" href="mailto:geral.afprotect@gmail.com?subject=Pedido%20de%20or%C3%A7amento">Pedir orçamento <ArrowUpRight /></a>
            <a className="button button--secondary" href="#servicos">Conhecer serviços</a>
          </div>
        </div>
      </div>
      <figure className="hero__image">
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/heromobile-afprotect.jpg" />
          <img src="/images/hero-afprotect.jpg" alt="Instalações e viatura de assistência técnica da AFPROTECT" />
        </picture>
        <figcaption>Manutenção técnica / AFPROTECT</figcaption>
      </figure>
      <a href="#empresa" className="hero__scroll" aria-label="Descer para a secção Empresa"><ArrowDown /></a>
    </section>
  );
}
