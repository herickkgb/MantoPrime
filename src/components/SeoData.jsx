import { products } from "../data/products.js";

const SITE_URL = "https://bh-mantos.com.br";
const STORE_NAME = "BH-Mantos";
const STORE_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "R. Pirarucu, 30",
  addressLocality: "Santa Luzia",
  addressRegion: "MG",
  postalCode: "33130-320",
  addressCountry: "BR",
};

function SeoData() {
  const itemList = {
    "@type": "ItemList",
    name: "Catálogo de camisas de futebol BH-Mantos",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/#produto-${product.id}`,
      item: {
        "@type": "Product",
        name: product.nome,
        image: product.imagens.map((image) => `${SITE_URL}${image}`),
        brand: {
          "@type": "Brand",
          name: STORE_NAME,
        },
        category: `${product.categoria} - ${product.tipo}`,
        description: `Camisa de futebol ${product.nome}, modelo ${product.tipo}. Consulte disponibilidade, tamanhos e valores pelo WhatsApp.`,
      },
    })),
  };
  const localStore = {
    "@type": "Store",
    name: STORE_NAME,
    alternateName: "BH Mantos",
    url: SITE_URL,
    description:
      "Catálogo online de camisas de futebol com atendimento em Belo Horizonte, Santa Luzia e região metropolitana.",
    telephone: "+55 31 99530-9630",
    address: STORE_ADDRESS,
    areaServed: [
      "Belo Horizonte",
      "Santa Luzia",
      "Região Metropolitana de Belo Horizonte",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55 31 99530-9630",
      contactType: "Atendimento pelo WhatsApp",
      availableLanguage: "Portuguese",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [localStore, itemList],
        }),
      }}
    />
  );
}

export default SeoData;
