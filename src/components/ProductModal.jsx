import { useEffect, useState } from "react";
import { Gift, MessageCircle, Minus, Plus, ShoppingBag, X } from "lucide-react";

function ProductModal({ product, onClose, onAddToCart, onDirectOrder }) {
  const [selectedImage, setSelectedImage] = useState(product.imagens[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [warning, setWarning] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("body-locked");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("body-locked");
    };
  }, [onClose]);

  const requireSize = () => {
    if (!selectedSize) {
      setWarning("Escolha um tamanho antes de continuar.");
      return false;
    }

    setWarning("");
    return true;
  };

  const handleAdd = () => {
    if (!requireSize()) return;
    const added = onAddToCart(product, selectedSize, quantity);
    if (added) onClose();
  };

  const handleDirectOrder = () => {
    if (!requireSize()) return;
    onDirectOrder(product, selectedSize, quantity);
  };

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <button
          className="icon-button modal-close"
          type="button"
          onClick={onClose}
          aria-label="Fechar detalhes"
        >
          <X size={22} aria-hidden="true" />
        </button>

        <div className="modal-gallery">
          <div className="modal-main-image">
            {imageFailed ? (
              <div className="image-fallback large">
                <span>BH-Mantos</span>
                <small>{product.time}</small>
              </div>
            ) : (
              <img
                src={selectedImage}
                alt={product.nome}
                decoding="async"
                onError={() => setImageFailed(true)}
              />
            )}
          </div>
          <div className="thumbnail-row">
            {product.imagens.map((image) => (
              <button
                className={selectedImage === image ? "thumbnail-active" : ""}
                type="button"
                key={image}
                onClick={() => {
                  setSelectedImage(image);
                  setImageFailed(false);
                }}
                aria-label={`Ver imagem ${product.imagens.indexOf(image) + 1}`}
              >
                <img src={image} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        </div>

        <div className="modal-details">
          <div className="product-meta">
            <span>{product.categoria}</span>
            <span>{product.tipo}</span>
          </div>
          <p className="team-name">{product.time}</p>
          <h2 id="product-modal-title">{product.nome}</h2>
          <p className="modal-copy">
            Modelo selecionado com atendimento direto pelo WhatsApp para
            confirmar valores, disponibilidade, entrega e formas de pagamento.
          </p>

          <div className="modal-size-block">
            <strong>Tamanhos disponíveis</strong>
            <div className="size-selector">
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
          </div>

          <div className="quantity-control">
            <strong>Quantidade</strong>
            <div>
              <button
                className="icon-button"
                type="button"
                onClick={() => setQuantity((current) => Math.max(current - 1, 1))}
                aria-label="Diminuir quantidade"
              >
                <Minus size={18} aria-hidden="true" />
              </button>
              <span>{quantity}</span>
              <button
                className="icon-button"
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                aria-label="Aumentar quantidade"
              >
                <Plus size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          {warning && <p className="form-warning">{warning}</p>}

          <div className="modal-gift">
            <Gift size={19} aria-hidden="true" />
            <span>Brinde surpresa incluso na compra de uma camisa.</span>
          </div>

          <div className="modal-actions">
            <button className="primary-button" type="button" onClick={handleAdd}>
              <ShoppingBag size={18} aria-hidden="true" />
              Adicionar ao carrinho
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={handleDirectOrder}
            >
              <MessageCircle size={18} aria-hidden="true" />
              Pedir pelo WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
