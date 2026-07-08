import { MessageCircle, PackageCheck, Ruler, ShoppingBag } from "lucide-react";

const steps = [
  {
    title: "Escolha sua camisa favorita no catálogo.",
    icon: ShoppingBag,
  },
  {
    title: "Selecione tamanho e quantidade.",
    icon: Ruler,
  },
  {
    title: "Adicione ao carrinho ou peça direto pelo WhatsApp.",
    icon: MessageCircle,
  },
  {
    title:
      "Receba no WhatsApp os valores, disponibilidade, entrega e seu brinde surpresa.",
    icon: PackageCheck,
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
          const Icon = step.icon;

          return (
            <article className="step-card" key={step.title}>
              <span className="step-number">{index + 1}</span>
              <Icon size={24} aria-hidden="true" />
              <strong>{step.title}</strong>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default HowToBuy;
