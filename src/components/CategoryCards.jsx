import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Série A",
    title: "Brasileirão Série A",
    description: "Modelos nacionais selecionados para quem acompanha o jogo de perto.",
    icon: "/icones-instagram/brasileirao.png",
  },
  {
    name: "Europa",
    title: "Clubes Europeus",
    description: "Camisas dos maiores clubes europeus em uma curadoria premium.",
    icon: "/icones-instagram/europa.png",
  },
];

function CategoryCards({ activeCategory, onSelectCategory }) {
  return (
    <section className="section-shell categories-section" aria-label="Categorias">
      {categories.map((category) => {
        const isActive = activeCategory === category.name;

        return (
          <button
            className={`category-card ${isActive ? "category-card-active" : ""}`}
            type="button"
            key={category.name}
            onClick={() => onSelectCategory(category.name)}
          >
            <span className="category-icon">
              <img src={category.icon} alt="" aria-hidden="true" />
            </span>
            <span>
              <strong>{category.title}</strong>
              <small>{category.description}</small>
            </span>
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        );
      })}
    </section>
  );
}

export default CategoryCards;
