import { useState } from "react";
import { ArrowUpRight, Check, ChevronDown, MapPin } from "lucide-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductShowcase from "./components/ProductShowcase";

const services = [
  ["01", "Extintores", "Venda, instalação, manutenção e inspeção técnica.", true],
  ["02", "Alarmes de intrusão", "Soluções de alarme por cabo e via rádio.", true],
  ["03", "Câmaras e videovigilância", "Sistemas CCTV para proteção e monitorização.", true],
  ["04", "Deteção de incêndio", "Instalação e manutenção de sistemas de deteção.", false],
  ["05", "Portas corta-fogo", "Soluções de compartimentação e proteção.", false],
  ["06", "Segurança e emergência", "Sinalização, iluminação e equipamentos de apoio.", false],
];

const products = [
  ["01", "Extintores pó ABC", "1 a 50 kg", "/images/extintor-po.PNG"],
  ["02", "Extintores água + aditivo", "1 a 50 kg", "/images/extintor-agua.PNG"],
  ["03", "Extintores CO₂", "2 a 25 kg", "/images/extintor-co2.PNG"],
  ["04", "Mantas ignífugas", "Proteção de primeira intervenção", "/images/mantas.PNG"],
  ["05", "Sinalética de emergência", "Orientação e identificação", "/images/sinaletica.PNG"],
  ["06", "Alarmes de intrusão", "Via rádio e via cabo", "/images/alarmes-intrusao.PNG"],
  ["07", "Câmaras de videovigilância", "Soluções de monitorização", "/images/camaras-videovigilancia.PNG"],
  ["08", "Armaduras de emergência", "Iluminação de segurança", "/images/armaduras-emergencia.PNG"],
  ["09", "Portas corta-fogo", "Compartimentação resistente ao fogo", "/images/porta-corta-fogo.PNG"],
  ["10", "Outros equipamentos", "Soluções de segurança à medida", "/images/outros.PNG"],
];

const clients = [
  { name: "Laser Place", logo: "/images/laser-place copy.png" },
  { name: "O Cabeças", logo: "/images/cabeças.png" },
  { name: "Audika", logo: "/images/audika.png" },
  { name: "Mayoral", logo: "/images/Mayoral_Logo.png" },
  { name: "Motel Alto de Valongo", logo: "/images/logo-motel-retina.png" },
  { name: "Filtaporto", logo: "/images/filtaporto.png" },
  { name: "Transporel", logo: "/images/transporel.png" },
];

const articles = [
  {
    number: "01",
    category: "Guia",
    title: "Instalação e posicionamento de extintores",
    description: "O extintor deve estar visível, acessível e próximo dos caminhos de evacuação. Estes são os principais critérios do artigo 163.º do RT-SCIE:",
    points: [
      "Até 15 m de percurso entre a saída de um local de risco e o extintor mais próximo.",
      "Manípulo a uma altura máxima de 1,20 m, com o equipamento num suporte próprio.",
      "Localização preferencial nos percursos de circulação e junto às saídas de grandes espaços.",
      "Equipamento visível, sinalizado quando necessário e sempre com o acesso desimpedido.",
    ],
    note: "A quantidade, o agente extintor e a localização final dependem dos riscos concretos de cada espaço.",
    sourceUrl: "https://diariodarepublica.pt/dr/detalhe/portaria/1532-2008-444380",
    sourceLabel: "Consultar o artigo 163.º do RT-SCIE",
  },
  {
    number: "02",
    category: "Manutenção",
    title: "Porque é essencial manter os equipamentos operacionais",
    description: "A manutenção permite confirmar o estado do equipamento e detetar anomalias antes de uma emergência. Entre intervenções técnicas, deve verificar-se se o extintor permanece acessível, sinalizado, sem danos aparentes e com os elementos de segurança intactos.",
    note: "As intervenções de manutenção devem ser realizadas por uma entidade devidamente certificada.",
  },
  {
    number: "03",
    category: "Equipamento",
    title: "Como distinguir os diferentes tipos de extintores",
    description: "O pó ABC é versátil para vários riscos comuns; o CO₂ é usado frequentemente em equipamentos elétricos por não deixar resíduos; e a água com aditivo é indicada para classes de fogo compatíveis com a classificação do equipamento.",
    note: "Nunca utilize um agente extintor sem confirmar a sua compatibilidade com o risco presente.",
  },
  {
    number: "04",
    category: "Sinalização",
    title: "Sinalética de segurança e emergência",
    description: "A sinalização identifica equipamentos, saídas e percursos de evacuação. Deve ser facilmente reconhecível, estar bem posicionada e permanecer visível nas condições previstas para o espaço, sem mobiliário ou outros elementos a ocultá-la.",
    note: "A sinalização deve acompanhar a configuração real do espaço e os restantes meios de segurança.",
  },
  {
    number: "05",
    category: "Legislação",
    title: "Segurança contra incêndio em edifícios (SCIE)",
    description: "O regime de SCIE estabelece responsabilidades e requisitos que variam conforme a utilização-tipo e a categoria de risco do edifício. Pode abranger projeto, equipamentos, manutenção, inspeções e medidas de autoproteção.",
    note: "O enquadramento deve ser confirmado para cada edifício com base na legislação e documentação técnica em vigor.",
  },
  {
    number: "06",
    category: "Prevenção",
    title: "Recomendações práticas para espaços mais seguros",
    description: "Mantenha saídas, portas e equipamentos desobstruídos; não improvise alterações nos sistemas de segurança; comunique anomalias; e garanta que as pessoas conhecem os procedimentos básicos de alarme e evacuação.",
    note: "Uma rotina de verificação e formação reduz falhas e melhora a resposta numa situação de emergência.",
  },
];

const serviceMailto = (service) =>
  `mailto:geral.afprotect@gmail.com?subject=${encodeURIComponent(`Pedido de informação — Serviço de ${service}`)}`;

function SectionLabel({ index, children, light = false }) {
  return <p className={`section-label ${light ? "section-label--light" : ""}`}><span>{index}</span><span className="section-label__text">{children}</span></p>;
}

function App() {
  const [openArticle, setOpenArticle] = useState(null);
  const [infoView, setInfoView] = useState("credentials");

  return (
    <>
      <Header />
      <main>
        <Hero />

        <section id="empresa" className="section about wrap">
          <SectionLabel index="02">Sobre Nós</SectionLabel>
          <div className="about__grid">
            <h2>10+ anos a proteger <em>o essencial.</em></h2>
            <div className="about__copy">
              <p className="lead">A segurança constrói-se com conhecimento, rigor e presença.</p>
              <p>Fundada em 2015, a AFPROTECT desenvolve soluções de proteção contra incêndios e sistemas de segurança para empresas, comércio e particulares.</p>
              <p>Da instalação à manutenção, acompanhamos cada espaço com uma abordagem técnica, próxima e responsável.</p>
              <a className="text-link" href="#contactos">Conhecer a nossa abordagem <ArrowUpRight /></a>
            </div>
          </div>
          <div className="about__facts">
            <div><strong>2015</strong><span>Ano de fundação</span></div>
            <div><strong>Porto</strong><span>Sede em Fânzeres, Gondomar</span></div>
            <div><strong>3 áreas</strong><span>Instalação, manutenção e assistência</span></div>
          </div>
        </section>

        <section id="servicos" className="section services">
          <div className="wrap">
            <SectionLabel index="03" light>Serviços</SectionLabel>
            <div className="section-intro section-intro--light">
              <h2>Proteção, <em>por inteiro.</em></h2>
              <p>Soluções técnicas pensadas para reduzir o risco, proteger pessoas e assegurar a continuidade de cada espaço.</p>
            </div>
            <div className="service-list">
              {services.map(([number, title, description, featured]) => (
                <a href={serviceMailto(title)} className={`service ${featured ? "service--featured" : ""}`} aria-label={`Pedir informação sobre ${title}`} key={number}>
                  <span>{number}</span>{featured && <small>Em destaque</small>}<h3>{title}</h3><p>{description}</p><span className="service__action">Pedir informação</span><ArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="produtos" className="section products wrap">
          <SectionLabel index="04">Equipamentos</SectionLabel>
          <div className="section-intro">
            <h2>Equipamentos <em>de segurança.</em></h2>
            <p className="products__intro-copy">
              <span>Uma seleção profissional para prevenção, deteção e</span>
              <span>primeira intervenção. Consulte-nos para encontrar a solução indicada.</span>
            </p>
          </div>
          <ProductShowcase products={products} />
        </section>

        <div id="certificacoes" className="info-hub">
        <div className="info-hub__navigation">
          <div className="wrap info-hub__navigation-inner">
            <span>Informação técnica</span>
            <div className="info-hub__tabs" role="tablist" aria-label="Certificações e conhecimento">
              <button type="button" role="tab" aria-selected={infoView === "credentials"} aria-controls="credentials-panel" onClick={() => setInfoView("credentials")}> Certificações</button>
              <button type="button" role="tab" aria-selected={infoView === "knowledge"} aria-controls="knowledge-panel" onClick={() => setInfoView("knowledge")}> Conhecimento</button>
            </div>
          </div>
        </div>
        {infoView === "credentials" ? <section id="credentials-panel" role="tabpanel" className="section credentials">
          <div className="wrap">
            <SectionLabel index="05" light>Certificações</SectionLabel>
            <div className="credentials__head"><h2>Rigor <em>comprovado.</em></h2><p>Credenciais que suportam o nosso compromisso técnico e ajudam a construir relações de confiança.</p></div>
            <div className="credential">
              <div className="credential__logo credential__logo--psp"><img src="/images/certificacao-psp.png" alt="Entidade instaladora de sistemas de segurança certificada pela Polícia de Segurança Pública" /></div><div><span>PSP · Registo prévio</span><h3>N.º 7114</h3></div>
              <p>Instalação, manutenção e assistência técnica para os equipamentos e atividades de segurança abrangidos pelo certificado oficial.</p>
              <div className="credential__date"><span>Validade</span><strong>15.10.2025 — 15.10.2030</strong></div>
            </div>
            <div className="credential">
              <div className="credential__logo credential__logo--eic"><img src="/images/certificacao-eic.png" alt="Serviço certificado EIC para manutenção de extintores segundo a NP 4413" /></div><div><span>EIC · Certificado</span><h3>SME-0627</h3></div>
              <p>Manutenção de extintores certificada de acordo com a norma NP 4413:2019.</p>
              <div className="credential__date"><span>Validade</span><strong>16.11.2027</strong></div>
            </div>
            <div className="credential">
              <div className="credential__wordmark" aria-hidden="true">ANEPC</div><div><span>Proteção Civil · Registo</span><h3>N.º 3683</h3></div>
              <p>Entidade registada na Autoridade Nacional de Emergência e Proteção Civil.</p>
              <div className="credential__date"><span>Referência</span><strong>ANEPC N.º 3683</strong></div>
            </div>
            <p className="credentials__note"><Check /> Consulte os documentos oficiais para conhecer o âmbito integral das certificações.</p>
          </div>
        </section> : null}

        {infoView === "knowledge" ? <section id="knowledge-panel" role="tabpanel" className="section knowledge wrap">
          <SectionLabel index="06">Conhecimento</SectionLabel>
          <div className="section-intro"><h2>Conhecimento <em>que protege.</em></h2><p>Informação introdutória para decisões mais seguras. Abra cada tema para conhecer os principais cuidados e recomendações.</p></div>
          <div className="article-list">
            {articles.map(({ number, category, title, description, points, note, sourceUrl, sourceLabel }) => {
              const isOpen = openArticle === number;
              const panelId = `knowledge-panel-${number}`;
              return (
                <article className={`knowledge-item ${isOpen ? "is-open" : ""}`} key={number}>
                  <button
                    className="knowledge-item__trigger"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenArticle(isOpen ? null : number)}
                  >
                    <span>{number}</span>
                    <span className="knowledge-item__title"><small>{category}</small><strong>{title}</strong></span>
                    <ChevronDown aria-hidden="true" />
                  </button>
                  <div className="knowledge-item__panel" id={panelId} aria-hidden={!isOpen}>
                    <div className="knowledge-item__content">
                      <p>{description}</p>
                      {points && <ul>{points.map((point) => <li key={point}>{point}</li>)}</ul>}
                      <p className="knowledge-item__note">{note}</p>
                      {sourceUrl && <a className="knowledge-item__source" href={sourceUrl} target="_blank" rel="noreferrer">{sourceLabel} <ArrowUpRight /></a>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section> : null}
        </div>

        <section id="clientes" className="section clients">
          <div className="wrap">
            <SectionLabel index="07" light>Clientes</SectionLabel>
            <div className="clients__head">
              <h2>Confiança construída <em>no terreno.</em></h2>
              <p>Algumas das empresas que confiam na AFPROTECT.</p>
            </div>
            <div className="clients__grid" aria-label="Clientes AFPROTECT">
              {clients.map((client, index) => (
                <div className="client" key={client.name}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div className="client__brand">
                    {client.logo
                      ? <img
                          src={client.logo}
                          alt={`Logótipo ${client.name}`}
                          className={
                            client.name === "O Cabeças"
                              ? "client__logo--cabecas"
                              : client.name === "Transporel"
                                ? "client__logo--transporel"
                                : undefined
                          }
                        />
                      : <h3>{client.name}</h3>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contactos" className="contact">
          <div className="wrap">
            <SectionLabel index="08" light>Contactos</SectionLabel>
            <h2>Vamos proteger <em>o seu espaço?</em></h2>
            <a className="contact__email" href="mailto:geral.afprotect@gmail.com?subject=Pedido%20de%20or%C3%A7amento"><span>geral.afprotect@gmail.com</span><ArrowUpRight /></a>
            <div className="contact__grid">
              <div><span>Telefone</span><a href="tel:+351223259768">223 259 768</a><a href="tel:+351910978600">910 978 600</a></div>
              <div><span>Morada</span><a href="https://www.google.com/maps/search/?api=1&query=Rua+D.+Jo%C3%A3o+de+Castro+608+4510-546+F%C3%A2nzeres+Gondomar+Portugal" target="_blank" rel="noreferrer"><MapPin /> Rua D. João de Castro, n.º 608, R/C<br />4510-546 Fânzeres, Gondomar</a></div>
              <div><span>Horário</span><p>Segunda a sexta-feira<br />09:00–12:30 · 14:00–18:30</p></div>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="wrap"><img src="/images/logo-afprotect.png" alt="AFPROTECT" /><p>© 2026 AFPROTECT — Sociedade Unipessoal, Lda.</p><a href="#inicio">Voltar ao início ↑</a></div></footer>
    </>
  );
}

export default App;
