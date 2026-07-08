import { useState } from "react";
import { Eye, MessageCircle, ShoppingBag } from "lucide-react";

function ProductCard({ product, onAddToCart, onOpenDetails, onDirectOrder }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [warning, setWarning] = useState("");
  const [imageFailed, setImageFailed] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [loadSecondaryImage, setLoadSecondaryImage] = useState(false);
  const [secondaryReady, setSecondaryReady] = useState(false);

  const requireSize = () => {
    if (!selectedSize) {
      setWarning("Escolha um tamanho para continuar.");
      setQuickOpen(true);
      return false;
    }

    setWarning("");
    return true;
  };

  const handleAddToCart = () => {
    if (!requireSize()) return;
    onAddToCart(product, selectedSize, 1);
    setQuickOpen(false);
  };

  const handleDirectOrder = () => {
    if (!requireSize()) return;
    onDirectOrder(product, selectedSize, 1);
  };

  return (
    <article
      id={`produto-${product.id}`}
      className={`product-card ${warning ? "product-card-warning" : ""} ${
        quickOpen ? "product-card-quick-open" : ""
      } ${secondaryReady ? "product-card-secondary-ready" : ""}`}
      onMouseEnter={() => setLoadSecondaryImage(true)}
      onFocus={() => setLoadSecondaryImage(true)}
    >
      <div className="product-image">
        {imageFailed ? (
          <div className="image-fallback">
            <span>BH-Mantos</span>
            <small>{product.time}</small>
          </div>
        ) : (
          <div className="product-photo-stack">
            <img
              className="product-img-primary"
              src={product.imagens[0]}
              alt={product.nome}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
            {product.imagens[1] && loadSecondaryImage && (
              <img
                className="product-img-secondary"
                src={product.imagens[1]}
                alt=""
                loading="lazy"
                decoding="async"
                onLoad={() => setSecondaryReady(true)}
              />
            )}
          </div>
        )}

        <div className="quick-shop-panel">
          <div className="quick-size-grid" aria-label={`Tamanhos de ${product.nome}`}>
            {product.tamanhos.map((size) => (
              <button
                className={selectedSize === size ? "size-active" : ""}
                type="button"
                key={size}
                onClick={() => {
                  setSelectedSize(size);
                  setWarning("");
                }}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            ))}
          </div>

          {warning && <p className="form-warning">{warning}</p>}

          <button
            className="quick-add-button"
            type="button"
            onClick={handleAddToCart}
          >
            <ShoppingBag size={17} aria-hidden="true" />
            Adicionar à sacola
          </button>
        </div>
      </div>

      <div className="product-info">
        {product.brinde && <span className="custom-pill">Brinde surpresa</span>}
        <h3>{product.nome}</h3>
        <p className="team-name">
          {product.time} · {product.tipo}
        </p>
        <p className="price-label">Consultar no WhatsApp</p>
        <p className="price-helper">Valores confirmados no atendimento.</p>

        <button
          className="mobile-choose-button"
          type="button"
          onClick={() => setQuickOpen((current) => !current)}
        >
          {selectedSize ? `Adicionar tamanho ${selectedSize}` : "Escolher tamanho"}
        </button>

        <div className="product-card-links">
          <button
            className="product-link"
            type="button"
            onClick={() => onOpenDetails(product)}
          >
            <Eye size={17} aria-hidden="true" />
            Ver detalhes
          </button>
          <button className="product-link" type="button" onClick={handleDirectOrder}>
            <MessageCircle size={17} aria-hidden="true" />
            WhatsApp
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
