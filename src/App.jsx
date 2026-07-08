import { useEffect, useMemo, useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import CategoryCards from "./components/CategoryCards.jsx";
import Filters from "./components/Filters.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import ProductModal from "./components/ProductModal.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import HowToBuy from "./components/HowToBuy.jsx";
import TrustSection from "./components/TrustSection.jsx";
import FinalCTA from "./components/FinalCTA.jsx";
import Footer from "./components/Footer.jsx";
import SeoData from "./components/SeoData.jsx";
import { products } from "./data/products.js";
import {
  matchesAllTerms,
  normalizeText,
  splitSearchTerms,
} from "./utils/search.js";
import {
  abrirWhatsApp,
  criarMensagemContato,
  criarMensagemPedido,
  criarMensagemProduto,
} from "./utils/whatsapp.js";

const LOJA_NOME = "BH-Mantos";
const SLOGAN = "Camisas de futebol em BH e região.";
const WHATSAPP_DISPLAY = "+55 31 99530-9630";
const ENDERECO_LOJA =
  "R. Pirarucu, 30 - São Cosme de Cima, Santa Luzia - MG, 33130-320";
const CART_STORAGE_KEY = "bh_mantos_cart";

const initialFilters = {
  busca: "",
  categoria: "",
  time: "",
  tipo: "",
  cor: "",
  ordem: "nome",
};

const lerCarrinhoSalvo = () => {
  try {
    const salvo = localStorage.getItem(CART_STORAGE_KEY);
    return salvo ? JSON.parse(salvo) : [];
  } catch {
    return [];
  }
};

function App() {
  const [filters, setFilters] = useState(initialFilters);
  const [cartItems, setCartItems] = useState(lerCarrinhoSalvo);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const times = useMemo(
    () =>
      [...new Set(products.map((product) => product.time))].sort((a, b) =>
        a.localeCompare(b, "pt-BR"),
      ),
    [],
  );

  const cores = useMemo(
    () =>
      [
        ...new Set(
          products.flatMap((product) => (Array.isArray(product.cores) ? product.cores : [])),
        ),
      ].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [],
  );

  const filteredProducts = useMemo(() => {
    const buscaTermos = splitSearchTerms(filters.busca);
    const corSelecionada = normalizeText(filters.cor);

    const resultado = products.filter((product) => {
      const textoBusca = normalizeText(
        [
          product.nome,
          product.time,
          product.categoria,
          product.tipo,
          product.preco,
          product.precoValor,
          product.precoSegundaCamisa,
          product.precoSegundaCamisaValor,
          ...(product.cores ?? []),
          product.termosBusca,
        ].join(" "),
      );
      const coresProduto = (product.cores ?? []).map(normalizeText);
      const correspondeBusca = matchesAllTerms(textoBusca, buscaTermos);
      const correspondeCategoria =
        !filters.categoria || product.categoria === filters.categoria;
      const correspondeTime = !filters.time || product.time === filters.time;
      const correspondeTipo = !filters.tipo || product.tipo === filters.tipo;
      const correspondeCor =
        !filters.cor || coresProduto.includes(corSelecionada);

      return (
        correspondeBusca &&
        correspondeCategoria &&
        correspondeTime &&
        correspondeTipo &&
        correspondeCor
      );
    });

    return resultado.sort((a, b) => {
      if (filters.ordem === "time") {
        return a.time.localeCompare(b.time, "pt-BR");
      }

      if (filters.ordem === "categoria") {
        return a.categoria.localeCompare(b.categoria, "pt-BR");
      }

      if (filters.ordem === "cor") {
        return (a.cores?.[0] ?? "").localeCompare(b.cores?.[0] ?? "", "pt-BR");
      }

      if (filters.ordem === "preco") {
        return (a.precoValor ?? 0) - (b.precoValor ?? 0);
      }

      return a.nome.localeCompare(b.nome, "pt-BR");
    });
  }, [filters]);

  const destaqueProdutos = useMemo(
    () => products.filter((product) => product.destaque).slice(0, 6),
    [],
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantidade,
    0,
  );

  const scrollToSection = (sectionId, behavior = "smooth") => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    if (behavior === "auto") {
      const html = document.documentElement;
      const previousScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      section.scrollIntoView({ behavior: "auto", block: "start" });
      window.requestAnimationFrame(() => {
        html.style.scrollBehavior = previousScrollBehavior;
      });
      return;
    }

    section.scrollIntoView({ behavior, block: "start" });
  };

  const handleCategorySelect = (categoria) => {
    setFilters((current) => ({
      ...current,
      categoria,
      time: "",
    }));
    window.setTimeout(() => scrollToSection("catalogo"), 80);
  };

  const handleNavigate = (target) => {
    if (target === "inicio") scrollToSection("inicio");
    if (target === "catalogo") scrollToSection("catalogo");
    if (target === "como-comprar") scrollToSection("como-comprar", "auto");
    if (target === "carrinho") setIsCartOpen(true);
    if (target === "whatsapp") abrirWhatsApp(criarMensagemContato());
  };

  const addToCart = (product, tamanho, quantidade = 1) => {
    if (!tamanho) return false;

    const quantidadeNormalizada = Math.max(Number(quantidade) || 1, 1);
    const cartId = `${product.id}-${tamanho}`;

    setCartItems((current) => {
      const existing = current.find((item) => item.cartId === cartId);

      if (existing) {
        return current.map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                quantidade: item.quantidade + quantidadeNormalizada,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          cartId,
          produtoId: product.id,
          nome: product.nome,
          time: product.time,
          categoria: product.categoria,
          tipo: product.tipo,
          preco: product.preco,
          precoValor: product.precoValor,
          precoSegundaCamisa: product.precoSegundaCamisa,
          tamanho,
          quantidade: quantidadeNormalizada,
          imagem: product.imagens[0],
        },
      ];
    });

    setIsCartOpen(true);
    return true;
  };

  const pedirProdutoNoWhatsApp = (product, tamanho, quantidade = 1) => {
    if (!tamanho) return false;
    abrirWhatsApp(criarMensagemProduto(product, tamanho, quantidade));
    return true;
  };

  const finalizarPedido = (observacao) => {
    if (!cartItems.length) return;
    abrirWhatsApp(criarMensagemPedido(cartItems, observacao));
  };

  const changeCartQuantity = (cartId, direction) => {
    setCartItems((current) =>
      current.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantidade:
                direction === "increase"
                  ? item.quantidade + 1
                  : Math.max(item.quantidade - 1, 1),
            }
          : item,
      ),
    );
  };

  const removeCartItem = (cartId) => {
    setCartItems((current) => current.filter((item) => item.cartId !== cartId));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <>
      <SeoData />

      <Header
        lojaNome={LOJA_NOME}
        slogan={SLOGAN}
        cartCount={cartCount}
        onNavigate={handleNavigate}
        onCategorySelect={handleCategorySelect}
        searchValue={filters.busca}
        onSearchChange={(value) =>
          setFilters((current) => ({ ...current, busca: value }))
        }
        onSearchSubmit={() => scrollToSection("catalogo")}
      />

      <main>
        <Hero
          destaqueProdutos={destaqueProdutos}
          totalProducts={products.length}
          onCatalogClick={() => scrollToSection("catalogo")}
          onWhatsAppClick={() => abrirWhatsApp(criarMensagemContato())}
        />

        <CategoryCards
          activeCategory={filters.categoria}
          onSelectCategory={handleCategorySelect}
        />

        <section className="section-shell catalog-section" id="catalogo">
          <div className="section-heading">
            <span className="eyebrow">Catálogo premium</span>
            <h2>Escolha seu manto</h2>
            <p>
              Consulte disponibilidade, tamanhos e valores pelo WhatsApp.
            </p>
          </div>

          <Filters
            filters={filters}
            times={times}
            cores={cores}
            onChange={setFilters}
            onClear={clearFilters}
          />

          <ProductGrid
            products={filteredProducts}
            totalProducts={products.length}
            onAddToCart={addToCart}
            onOpenDetails={setSelectedProduct}
            onDirectOrder={pedirProdutoNoWhatsApp}
            onClearFilters={clearFilters}
          />
        </section>

        <HowToBuy />
        <TrustSection />
        <FinalCTA
          onCatalogClick={() => scrollToSection("catalogo")}
          onWhatsAppClick={() => abrirWhatsApp(criarMensagemContato())}
        />
      </main>

      <Footer whatsapp={WHATSAPP_DISPLAY} endereco={ENDERECO_LOJA} />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onIncrease={(cartId) => changeCartQuantity(cartId, "increase")}
        onDecrease={(cartId) => changeCartQuantity(cartId, "decrease")}
        onRemove={removeCartItem}
        onCheckout={finalizarPedido}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onDirectOrder={pedirProdutoNoWhatsApp}
        />
      )}

      <div className="floating-actions" aria-label="Ações rápidas">
        <button
          className="floating-button floating-whatsapp"
          type="button"
          onClick={() => abrirWhatsApp(criarMensagemContato())}
          aria-label="Falar com a BH-Mantos no WhatsApp"
        >
          <MessageCircle size={23} aria-hidden="true" />
        </button>
        <button
          className="floating-button floating-cart"
          type="button"
          onClick={() => setIsCartOpen(true)}
          aria-label={`Abrir carrinho com ${cartCount} itens`}
        >
          <ShoppingBag size={22} aria-hidden="true" />
          {cartCount > 0 && <span>{cartCount}</span>}
        </button>
      </div>
    </>
  );
}

export default App;
