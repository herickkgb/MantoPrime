import ProductCard from "./ProductCard.jsx";

function ProductGrid({
  products,
  totalProducts,
  onAddToCart,
  onOpenDetails,
  onDirectOrder,
  onClearFilters,
}) {
  return (
    <div className="products-area">
      <div className="products-summary">
        <strong>
          {products.length} {products.length === 1 ? "camisa encontrada" : "camisas encontradas"}
        </strong>
        <span>{totalProducts} modelos no catálogo</span>
      </div>

      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenDetails={onOpenDetails}
              onDirectOrder={onDirectOrder}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <strong>Nenhuma camisa encontrada</strong>
          <p>Ajuste os filtros ou limpe a busca para ver mais modelos.</p>
          <button className="secondary-button" type="button" onClick={onClearFilters}>
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
