const trustItems = [
  { title: "Atendimento direto no WhatsApp", icon: "/icones-instagram/whatsapp.png" },
  { title: "Clientes atendidos com atenção", icon: "/icones-instagram/clientes.png" },
  { title: "Modelos nacionais e europeus", icon: "/icones-instagram/europa.png" },
  { title: "Segunda camisa com desconto + brinde", icon: "/icones-instagram/brindes.png" },
  { title: "Tamanhos confirmados antes do pedido", icon: "/icones-instagram/tamanhos.png" },
  { title: "Loja física em Santa Luzia", icon: "/icones-instagram/loja-fisica.png" },
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
            return (
              <article className="trust-card" key={item.title}>
                <img className="trust-icon-image" src={item.icon} alt="" aria-hidden="true" />
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
