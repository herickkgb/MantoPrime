import { useEffect, useState } from "react";
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

function CartDrawer({
  isOpen,
  items,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}) {
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("body-locked");

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("body-locked");
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="cart-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        className="cart-drawer"
        aria-label="Carrinho de pedidos"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="cart-header">
          <div>
            <span className="eyebrow">Pedido pelo WhatsApp</span>
            <h2>Carrinho</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Fechar carrinho"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {items.length > 0 ? (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.cartId}>
                  <img src={item.imagem} alt={item.nome} />
                  <div className="cart-item-info">
                    <strong>{item.nome}</strong>
                    <span>{item.time}</span>
                    <small>
                      {item.categoria} · {item.tipo} · Tamanho {item.tamanho}
                    </small>
                    <div className="cart-controls">
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => onDecrease(item.cartId)}
                        aria-label={`Diminuir quantidade de ${item.nome}`}
                      >
                        <Minus size={16} aria-hidden="true" />
                      </button>
                      <span>{item.quantidade}</span>
                      <button
                        className="icon-button"
                        type="button"
                        onClick={() => onIncrease(item.cartId)}
                        aria-label={`Aumentar quantidade de ${item.nome}`}
                      >
                        <Plus size={16} aria-hidden="true" />
                      </button>
                      <button
                        className="icon-button remove-button"
                        type="button"
                        onClick={() => onRemove(item.cartId)}
                        aria-label={`Remover ${item.nome}`}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <label className="cart-observation">
              <span>Observação opcional</span>
              <textarea
                value={observacao}
                onChange={(event) => setObservacao(event.target.value)}
                rows={4}
                placeholder="Ex.: preferência de entrega, outro tamanho para confirmar, nome para atendimento..."
              />
            </label>

            <div className="cart-note">
              <strong>Valores confirmados no atendimento.</strong>
              <span>Brinde surpresa incluso na compra de uma camisa.</span>
            </div>

            <button
              className="primary-button checkout-button"
              type="button"
              onClick={() => onCheckout(observacao)}
            >
              <MessageCircle size={19} aria-hidden="true" />
              Finalizar pelo WhatsApp
            </button>
          </>
        ) : (
          <div className="empty-cart">
            <ShoppingBag size={42} aria-hidden="true" />
            <strong>Seu carrinho está vazio</strong>
            <p>Escolha uma camisa, selecione o tamanho e adicione ao pedido.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
