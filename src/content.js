import { useEffect, useState } from "react";

let contactEmail = "geral.afprotect@gmail.com";

export function useSiteContent() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    let active = true;
    fetch("/api/content", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Não foi possível carregar os conteúdos.");
        return response.json();
      })
      .then((data) => { if (active) { contactEmail = data.contact?.email || contactEmail; setContent(data); } })
      .catch((error) => {
        console.error(error);
        fetch("/content.json", { cache: "no-store" })
          .then((response) => response.json())
          .then((data) => { if (active) { contactEmail = data.contact?.email || contactEmail; setContent(data); } })
          .catch((fallbackError) => console.error(fallbackError));
      });
    return () => { active = false; };
  }, []);

  return content;
}

export function openContactEmail(context = "Pedido de orçamento") {
  window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(context)}`;
}
