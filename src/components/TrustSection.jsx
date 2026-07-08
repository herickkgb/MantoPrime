import {
  Gift,
  ListChecks,
  MessageCircle,
  Plane,
  Ruler,
  Smartphone,
} from "lucide-react";

const trustItems = [
  { title: "Atendimento direto no WhatsApp", icon: MessageCircle },
  { title: "Catálogo organizado por time", icon: ListChecks },
  { title: "Modelos nacionais e europeus", icon: Plane },
  { title: "Segunda camisa com desconto + brinde", icon: Gift },
  { title: "Tamanhos confirmados antes do pedido", icon: Ruler },
  { title: "Experiência mobile rápida", icon: Smartphone },
];

function TrustSection() {
  return (
    <section className="trust-section">
      <div className="section-shell">
        <div className="section-heading">
          <span className="eyebrow">Confiança no atendimento</span>
          <h2>Detalhes pensados para comprar melhor</h2>
        </div>

        <div className="trust-grid">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <article className="trust-card" key={item.title}>
                <Icon size={23} aria-hidden="true" />
                <strong>{item.title}</strong>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
