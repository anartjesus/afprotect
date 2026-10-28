import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";

const productMailto = (product) =>
  `mailto:geral.afprotect@gmail.com?subject=${encodeURIComponent(`Pedido de informação — ${product}`)}`;

function ProductListItem({ product, active, onSelect }) {
  const [number, name, description] = product;

  return (
    <li className={`equipment-list__item ${active ? "is-active" : ""}`}>
      <button
        type="button"
        className="equipment-list__trigger"
        aria-pressed={active}
        aria-label={`Mostrar ${name}`}
        onMouseEnter={onSelect}
        onClick={onSelect}
      >
        <span className="equipment-list__number">{number}</span>
        <span className="equipment-list__copy">
          <strong>{name}</strong>
          <span>{description}</span>
        </span>
      </button>
    </li>
  );
}

function MobileProductItem({ product, index, open, onToggle }) {
  const [number, name, description, image] = product;
  const panelId = `equipment-panel-${index}`;

  return (
    <article className={`equipment-accordion__item ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="equipment-accordion__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{number}</span>
        <strong>{name}</strong>
        <ChevronDown aria-hidden="true" />
      </button>
      <div id={panelId} className="equipment-accordion__panel" hidden={!open}>
        <div className="equipment-accordion__image">
          <img src={image} alt={name} loading="lazy" />
        </div>
        <p>{description}</p>
        <a href={productMailto(name)}>Pedir informação <ArrowUpRight aria-hidden="true" /></a>
      </div>
    </article>
  );
}

export default function ProductShowcase({ products }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);
  const activeProduct = products[activeIndex];
  const [number, name, description, image] = activeProduct;

  return (
    <>
      <div className="equipment-showcase">
        <ol className="equipment-list equipment-list--left">
          {products.slice(0, 5).map((product, index) => (
            <ProductListItem
              key={product[0]}
              product={product}
              active={activeIndex === index}
              onSelect={() => setActiveIndex(index)}
            />
          ))}
        </ol>

        <div className="equipment-feature" aria-live="polite">
          <div className="equipment-feature__image">
            <img key={number} src={image} alt={name} />
          </div>
          <div className="equipment-feature__meta"><span>{number}</span><span>Equipamentos</span></div>
          <h3>{name}</h3>
          <p>{description}</p>
          <a href={productMailto(name)}>Pedir informação <ArrowUpRight aria-hidden="true" /></a>
        </div>

        <ol className="equipment-list equipment-list--right" start="6">
          {products.slice(5).map((product, index) => {
            const productIndex = index + 5;
            return (
              <ProductListItem
                key={product[0]}
                product={product}
                active={activeIndex === productIndex}
                onSelect={() => setActiveIndex(productIndex)}
              />
            );
          })}
        </ol>
      </div>

      <div className="equipment-accordion">
        {products.map((product, index) => (
          <MobileProductItem
            key={product[0]}
            product={product}
            index={index}
            open={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </>
  );
}
