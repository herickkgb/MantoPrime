import { PARCELAMENTO_CAMISA, PRECO_CAMISA } from "../config/commercial.js";

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
          Horizonte, Santa Luzia e região metropolitana. Camisa por{" "}
          {PRECO_CAMISA} {PARCELAMENTO_CAMISA}; consulte disponibilidade,
          tamanhos e prazo de entrega pelo WhatsApp.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
