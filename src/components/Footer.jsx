function Footer({ whatsapp, endereco }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>BH-Mantos</strong>
          <span>Camisas de futebol em BH e região metropolitana.</span>
        </div>
        <div>
          <span>WhatsApp: {whatsapp}</span>
          <span>Loja física: {endereco}</span>
        </div>
        <p>
          Catálogo online de camisas de futebol com atendimento para Belo
          Horizonte, Santa Luzia e região metropolitana. Consulte
          disponibilidade, tamanhos, valores e prazo de entrega pelo WhatsApp.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
