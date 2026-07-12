import { PROMO_SEGUNDA_COMPLETA } from "../config/commercial.js";

const steps = [
  {
    title: "Escolha sua camisa favorita no catálogo.",
    icon: "/icones-instagram/como-comprar.png",
  },
  {
    title: "Selecione tamanho e quantidade.",
    icon: "/icones-instagram/tamanhos.png",
  },
  {
    title: "Adicione ao carrinho ou peça direto pelo WhatsApp.",
    icon: "/icones-instagram/whatsapp.png",
  },
  {
    title:
      `Confirme disponibilidade, entrega e a promoção: ${PROMO_SEGUNDA_COMPLETA}`,
    icon: "/icones-instagram/entregas.png",
  },
];

function HowToBuy() {
  return (
    <section className="section-shell how-section" id="como-comprar">
      <div className="section-heading">
        <span className="eyebrow">Pedido simples na BH-Mantos</span>
        <h2>Como comprar</h2>
        <p>
          Você não precisa pagar pelo site. O atendimento é feito diretamente
          pelo WhatsApp para confirmar todos os detalhes do pedido com
          segurança.
        </p>
      </div>

      <div className="steps-grid">
        {steps.map((step, index) => {
          return (
            <article className="step-card" key={step.title}>
              <span className="step-number">{index + 1}</span>
              <img className="step-icon-image" src={step.icon} alt="" aria-hidden="true" />
              <strong>{step.title}</strong>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default HowToBuy;
