import {
  ArrowRight,
  BadgeCheck,
  Gift,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function Hero({ destaqueProdutos, totalProducts, onCatalogClick, onWhatsAppClick }) {
  const stageProducts = destaqueProdutos.slice(0, 4);
  const catalogLabel =
    totalProducts >= 100 ? `${Math.floor(totalProducts / 100) * 100}+` : totalProducts;
  const marqueeItems = [
    "Brasileirão Série A",
    "Clubes europeus",
    "Brinde surpresa",
    "Atendimento no WhatsApp",
    "Tamanhos sob consulta",
  ];

  return (
    <section className="hero" id="inicio">
      <div className="hero-pattern" aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-content">
          <div className="premium-badge">
            <ShieldCheck size={18} aria-hidden="true" />
            Belo Horizonte, Santa Luzia e região
          </div>
          <h1>BH-Mantos</h1>
          <p>
            Camisas de futebol com curadoria esportiva, catálogo rápido e
            atendimento direto pelo WhatsApp para BH e região metropolitana.
          </p>

          <div className="hero-stats" aria-label="Destaques da BH-Mantos">
            <span>
              <strong>{catalogLabel}</strong>
              modelos no catálogo
            </span>
            <span>
              <strong>BH</strong>
              e região
            </span>
            <span>
              <strong>100%</strong>
              direto no WhatsApp
            </span>
          </div>

          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={onCatalogClick}>
              Ver catálogo
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              className="secondary-button dark-button"
              type="button"
              onClick={onWhatsAppClick}
            >
              <MessageCircle size={18} aria-hidden="true" />
              Falar no WhatsApp
            </button>
          </div>

          <div className="hero-gift">
            <Gift size={20} aria-hidden="true" />
            <span>Na compra de uma camisa, ganhe um brinde surpresa.</span>
          </div>
        </div>

        <div className="hero-showcase" aria-label="Vitrine de camisas em destaque">
          <div className="showcase-frame">
            <div className="showcase-header">
              <span>
                <Sparkles size={16} aria-hidden="true" />
                Vitrine em destaque
              </span>
              <strong>BH-Mantos</strong>
            </div>

            <div className="showcase-stage">
              {stageProducts.map((product, index) => (
                <article
                  className={`floating-jersey floating-jersey-${index + 1}`}
                  key={product.id}
                >
                  <img
                    src={product.imagens[0]}
                    alt={product.nome}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                  <span>{product.time}</span>
                </article>
              ))}
            </div>

            <div className="showcase-footer">
              <span>
                <BadgeCheck size={16} aria-hidden="true" />
                Consulta rápida
              </span>
              <span>Valores no atendimento</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-marquee" aria-label="Benefícios do catálogo">
        <div>
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <span key={`${item}-${index}`}>
              {item}
              <Gift size={15} aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      <div className="gift-banner">
        <div>
          <strong>Comprou uma camisa? Ganhe um brinde surpresa.</strong>
          <span>
            O brinde é enviado conforme disponibilidade e confirmado no
            atendimento.
          </span>
        </div>
        <Gift size={28} aria-hidden="true" />
      </div>
    </section>
  );
}

export default Hero;
