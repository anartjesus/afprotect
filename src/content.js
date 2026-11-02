import { useEffect, useState } from "react";

export function useSiteContent() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let active = true;
    fetch("/content.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Não foi possível carregar os conteúdos.");
        return response.json();
      })
      .then((data) => { if (active) setContent(data); })
      .catch((error) => console.error(error));
    return () => { active = false; };
  }, []);

  return content;
}

export function openContactForm(context = "Pedido de orçamento") {
  window.dispatchEvent(new CustomEvent("afprotect:contact", { detail: { context } }));
}
