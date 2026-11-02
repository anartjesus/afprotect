import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, X } from "lucide-react";

const initialForm = { name: "", email: "", phone: "", message: "", website: "" };

export default function ContactForm() {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState("Pedido de orçamento");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleOpen = (event) => {
      setContext(event.detail?.context || "Pedido de orçamento");
      setStatus("idle");
      setFeedback("");
      setOpen(true);
    };
    window.addEventListener("afprotect:contact", handleOpen);
    return () => window.removeEventListener("afprotect:contact", handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => dialogRef.current?.focus());
    const closeOnEscape = (event) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, context }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Não foi possível enviar o pedido.");
      setStatus("success");
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setFeedback(error.message);
    }
  };

  if (!open) return null;

  return (
    <div className="contact-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section ref={dialogRef} className="contact-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="contact-form-title" tabIndex="-1">
        <button className="contact-modal__close" type="button" onClick={() => setOpen(false)} aria-label="Fechar formulário"><X /></button>
        {status === "success" ? (
          <div className="contact-modal__success">
            <Check />
            <p>Pedido enviado</p>
            <h2>Obrigado pelo contacto.</h2>
            <span>A equipa AFPROTECT responderá com a maior brevidade possível.</span>
            <button type="button" className="button button--primary" onClick={() => setOpen(false)}>Fechar</button>
          </div>
        ) : (
          <>
            <p className="contact-modal__eyebrow">{context}</p>
            <h2 id="contact-form-title">Como podemos <em>ajudar?</em></h2>
            <form onSubmit={submit}>
              <label>Nome <input name="name" value={form.name} onChange={update} autoComplete="name" required /></label>
              <div className="contact-modal__row">
                <label>E-mail <input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required /></label>
                <label>Telefone <input name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" /></label>
              </div>
              <label>Mensagem <textarea name="message" value={form.message} onChange={update} rows="5" required /></label>
              <label className="contact-modal__honeypot" aria-hidden="true">Website <input name="website" value={form.website} onChange={update} tabIndex="-1" autoComplete="off" /></label>
              {status === "error" && <p className="contact-modal__error" role="alert">{feedback}</p>}
              <button className="button button--primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "A enviar…" : <>Enviar pedido <ArrowUpRight /></>}</button>
              <small>Ao enviar, autoriza o tratamento destes dados exclusivamente para resposta ao seu pedido.</small>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
