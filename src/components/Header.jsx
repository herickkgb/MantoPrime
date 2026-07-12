import { useEffect, useState } from "react";
import { Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";

function Header({
  lojaNome,
  slogan,
  cartCount,
  onNavigate,
  onCategorySelect,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const runAction = (action) => {
    action();
    setMenuOpen(false);
  };

  const menuItems = [
    { label: "Início", action: () => onNavigate("inicio") },
    { label: "Série A", action: () => onCategorySelect("Série A") },
    { label: "Europa", action: () => onCategorySelect("Europa") },
    { label: "Como comprar", action: () => onNavigate("como-comprar") },
    { label: "Carrinho", action: () => onNavigate("carrinho") },
  ];

  return (
    <header className={`site-header ${scrolled ? "site-header-scrolled" : ""}`}>
      <div className="header-inner">
        <button
          className="brand"
          type="button"
          onClick={() => runAction(() => onNavigate("inicio"))}
          aria-label="Voltar para o início"
        >
          <span className="brand-mark" aria-hidden="true">
            <img src="/icons/icon-192.png" alt="" />
          </span>
          <span>
            <strong>{lojaNome}</strong>
            <small>{slogan}</small>
          </span>
        </button>

        <nav className="desktop-nav" aria-label="Menu principal">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => runAction(item.action)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="icon-button cart-button"
            type="button"
            onClick={() => onNavigate("carrinho")}
            aria-label={`Abrir carrinho com ${cartCount} itens`}
          >
            <ShoppingBag size={20} aria-hidden="true" />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>

          <button
            className="whatsapp-top"
            type="button"
            onClick={() => onNavigate("whatsapp")}
          >
            <MessageCircle size={18} aria-hidden="true" />
            WhatsApp
          </button>

          <button
            className="icon-button menu-toggle"
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}>
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => runAction(item.action)}
          >
            {item.label}
          </button>
        ))}
        <button
          className="mobile-whatsapp"
          type="button"
          onClick={() => runAction(() => onNavigate("whatsapp"))}
        >
          <MessageCircle size={18} aria-hidden="true" />
          Falar no WhatsApp
        </button>
      </div>

      <form
        className="mobile-header-search"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          onSearchSubmit();
          setMenuOpen(false);
        }}
      >
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="O que você está procurando?"
          aria-label="Buscar camisas no catálogo"
        />
        <button type="submit" aria-label="Buscar no catálogo">
          Buscar
        </button>
      </form>
    </header>
  );
}

export default Header;
