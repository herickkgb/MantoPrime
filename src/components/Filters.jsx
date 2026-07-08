import { useEffect, useState } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

const tipoOptions = ["Torcedor", "Jogador", "Retrô", "Manga Longa"];

function Filters({ filters, times, cores, onChange, onClear }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("filters-open", mobileOpen);

    return () => document.body.classList.remove("filters-open");
  }, [mobileOpen]);

  const updateFilter = (key, value) => {
    onChange((current) => ({
      ...current,
      [key]: value,
      ...(key === "categoria" ? { time: "" } : {}),
    }));
  };

  return (
    <div className={`filters-panel ${mobileOpen ? "filters-panel-open" : ""}`}>
      <div className="filters-title">
        <span>
          <SlidersHorizontal size={20} aria-hidden="true" />
          <strong>Filtros</strong>
        </span>
        <button
          className="filters-mobile-toggle"
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
        >
          {mobileOpen ? "Fechar" : "Filtrar"}
        </button>
      </div>

      <div className="filters-body">
        <label className="search-field" htmlFor="catalog-search">
          <Search size={18} aria-hidden="true" />
          <input
            id="catalog-search"
            type="search"
            placeholder="Buscar"
            value={filters.busca}
            onChange={(event) => updateFilter("busca", event.target.value)}
          />
        </label>

        <label htmlFor="catalog-category">
          <span>Categoria</span>
          <select
            id="catalog-category"
            value={filters.categoria}
            onChange={(event) => updateFilter("categoria", event.target.value)}
          >
            <option value="">Todos</option>
            <option value="Série A">Série A</option>
            <option value="Europa">Europa</option>
          </select>
        </label>

        <label htmlFor="catalog-team">
          <span>Time</span>
          <select
            id="catalog-team"
            value={filters.time}
            onChange={(event) => updateFilter("time", event.target.value)}
          >
            <option value="">Todos</option>
            {times.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="catalog-type">
          <span>Tipo</span>
          <select
            id="catalog-type"
            value={filters.tipo}
            onChange={(event) => updateFilter("tipo", event.target.value)}
          >
            <option value="">Todos</option>
            {tipoOptions.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="catalog-color">
          <span>Cor</span>
          <select
            id="catalog-color"
            value={filters.cor}
            onChange={(event) => updateFilter("cor", event.target.value)}
          >
            <option value="">Todas</option>
            {cores.map((cor) => (
              <option key={cor} value={cor}>
                {cor}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="catalog-sort">
          <span>Ordenar</span>
          <select
            id="catalog-sort"
            value={filters.ordem}
            onChange={(event) => updateFilter("ordem", event.target.value)}
          >
            <option value="nome">Nome</option>
            <option value="time">Time</option>
            <option value="categoria">Categoria</option>
            <option value="cor">Cor</option>
            <option value="preco">Preço</option>
          </select>
        </label>

        <button className="clear-filters" type="button" onClick={onClear}>
          <RotateCcw size={17} aria-hidden="true" />
          Limpar
        </button>
      </div>
    </div>
  );
}

export default Filters;
