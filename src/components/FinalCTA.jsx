import { ArrowRight, MessageCircle } from "lucide-react";

function FinalCTA({ onCatalogClick, onWhatsAppClick }) {
  return (
    <section className="section-shell final-cta">
      <div>
        <span className="eyebrow">BH-Mantos</span>
        <h2>Já escolheu seu manto?</h2>
        <p>
          Monte seu pedido e fale com a BH-Mantos no WhatsApp para confirmar
          tamanhos, valores e disponibilidade.
        </p>
      </div>
      <div className="final-actions">
        <button className="primary-button" type="button" onClick={onCatalogClick}>
          Ver catálogo
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        <button className="secondary-button dark-button" type="button" onClick={onWhatsAppClick}>
          <MessageCircle size={18} aria-hidden="true" />
          Falar no WhatsApp
        </button>
      </div>
    </section>
  );
}

export default FinalCTA;
