import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const imagesRoot = path.join(projectRoot, "public", "imagens");
const optimizedImagesRoot = path.join(projectRoot, "public", "imagens-otimizadas");
const outputFile = path.join(projectRoot, "src", "data", "products.js");

const sections = [
  { dir: "serie-a", category: "Série A" },
  { dir: "europa", category: "Europa" },
];

const teamNames = {
  "AC-Milan": "AC Milan",
  Athletico: "Athletico",
  "Athletico-PR": "Athletico-PR",
  "Atletico-MG": "Atlético-MG",
  "Atletico-Madrid": "Atlético de Madrid",
  Avai: "Avaí",
  "Aston-Villa": "Aston Villa",
  "Athletic-Bilbao": "Athletic Bilbao",
  Bayern: "Bayern de Munique",
  "Borussia-Dortmund": "Borussia Dortmund",
  Ceara: "Ceará",
  Gremio: "Grêmio",
  "Inter-de-Milao": "Inter de Milão",
  "Manchester-City": "Manchester City",
  "Manchester-United": "Manchester United",
  "Real-Madrid": "Real Madrid",
  "Santa-Cruz": "Santa Cruz",
  "Sao-Paulo": "São Paulo",
  "Sport-Recife": "Sport Recife",
  Vitoria: "Vitória",
  "West-Ham": "West Ham",
};

const teamAliases = {
  "Atletico-MG": ["Atletico Mineiro", "Atlético Mineiro", "Galo"],
  "Atletico-Madrid": ["Atletico Madrid", "Atlético Madrid"],
  "Athletico-PR": ["Athletico Paranaense", "Furacao", "Furacão"],
  Corinthians: ["Timao", "Timão"],
  Cruzeiro: ["Raposa"],
  Flamengo: ["Fla", "Mengao", "Mengão"],
  Fluminense: ["Flu", "Tricolor"],
  Gremio: ["Gremio", "Grêmio"],
  Internacional: ["Inter", "Colorado"],
  Palmeiras: ["Verdao", "Verdão"],
  "Sao-Paulo": ["Sao Paulo", "São Paulo"],
  Vasco: ["Vascao", "Vascão"],
};

const termReplacements = {
  Retro: "Retrô",
  Player: "Jogador",
};

const colorTerms = [
  { label: "Amarela", terms: ["amarela", "amarelo", "amarelas", "amarelos"] },
  { label: "Azul", terms: ["azul", "azuis"] },
  { label: "Bege", terms: ["bege", "beges"] },
  { label: "Branca", terms: ["branca", "branco", "brancas", "brancos"] },
  { label: "Cinza", terms: ["cinza", "cinzas"] },
  { label: "Dourada", terms: ["dourada", "dourado", "douradas", "dourados"] },
  { label: "Grená", terms: ["grena", "grená"] },
  { label: "Laranja", terms: ["laranja", "laranjas"] },
  { label: "Marrom", terms: ["marrom", "marrons"] },
  { label: "Preta", terms: ["preta", "preto", "pretas", "pretos"] },
  { label: "Rosa", terms: ["rosa", "rosas"] },
  { label: "Roxa", terms: ["roxa", "roxo", "roxas", "roxos"] },
  { label: "Verde", terms: ["verde", "verdes"] },
  { label: "Vermelha", terms: ["vermelha", "vermelho", "vermelhas", "vermelhos"] },
  { label: "Vinho", terms: ["vinho", "vinhos"] },
];

const teamPriority = {
  Flamengo: 120,
  "Real-Madrid": 118,
  Barcelona: 116,
  "Atletico-MG": 114,
  Cruzeiro: 112,
  Palmeiras: 110,
  Corinthians: 108,
  PSG: 106,
  "Manchester-City": 104,
  "Manchester-United": 102,
  Bayern: 100,
  Arsenal: 98,
  Santos: 96,
  "Sao-Paulo": 94,
  Vasco: 92,
  Gremio: 90,
};

const collator = new Intl.Collator("pt-BR", {
  numeric: true,
  sensitivity: "base",
});

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const defaultSizes = ["P", "M", "G", "GG", "XG", "2XG"];
const defaultPrice = "R$ 149,90";
const defaultPriceValue = 149.9;
const secondShirtPromotionPrice = "R$ 109,90";
const secondShirtPromotionPriceValue = 109.9;
const commercialSearchTerms = [
  "R$ 149,90",
  "149,90",
  "149.90",
  "149",
  "cento e quarenta e nove",
  "6x",
  "seis vezes",
  "sem juros",
  "parcelamento",
  "R$ 109,90",
  "109,90",
  "109.90",
  "109",
  "cento e nove",
  "promoção",
  "promocao",
  "promo",
  "duas camisas",
  "2 camisas",
  "segunda camisa",
  "segunda por",
  "brinde",
  "brinde surpresa",
];

function listDirectories(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(collator.compare);
}

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
    .sort(collator.compare);
}

function displayTeamName(teamSlug) {
  return teamNames[teamSlug] ?? teamSlug.replaceAll("-", " ");
}

function normalizeText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function humanizeModel(modelSlug) {
  const protectedYears = modelSlug.replace(
    /(\d{4})-(\d{2})/g,
    "$1__YEAR_RANGE__$2",
  );

  return protectedYears
    .replaceAll("-", " ")
    .replaceAll("__YEAR_RANGE__", "-")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => termReplacements[word] ?? word)
    .join(" ")
    .trim();
}

function getModelSlug(teamSlug, folderName) {
  const parts = folderName.split("---");
  if (parts.length > 1) return parts.slice(1).join("---");

  return folderName.replace(new RegExp(`^${teamSlug}-?`), "") || folderName;
}

function inferType(modelSlug) {
  if (/Retro/i.test(modelSlug)) return "Retrô";
  if (/Manga-Longa/i.test(modelSlug)) return "Manga Longa";
  if (/Player/i.test(modelSlug)) return "Jogador";
  return "Torcedor";
}

function inferColors(modelSlug, folderName) {
  const source = ` ${normalizeText(`${modelSlug} ${folderName}`)} `;

  return colorTerms
    .filter(({ terms }) => terms.some((term) => source.includes(` ${term} `)))
    .map(({ label }) => label);
}

function buildSearchTerms({
  sectionDir,
  teamSlug,
  teamName,
  category,
  folderName,
  modelSlug,
  productName,
    type,
    price,
    promotionPrice,
    colors,
}) {
  const categoryTerms =
    sectionDir === "serie-a"
      ? ["serie a", "série a", "brasileirao", "brasileirão", "brasil"]
      : ["europa", "europeu", "europeus"];

  return uniqueValues([
    "BH-Mantos",
    "BH Mantos",
    "Belo Horizonte",
    "Santa Luzia",
    "Região Metropolitana de Belo Horizonte",
    productName,
    teamName,
    teamSlug.replaceAll("-", " "),
    ...(teamAliases[teamSlug] ?? []),
    category,
    ...categoryTerms,
    type,
    price,
    promotionPrice,
    ...commercialSearchTerms,
    "preco",
    "preço",
    "valor",
    "whatsapp",
    ...colors,
    humanizeModel(modelSlug),
    folderName.replaceAll("-", " "),
  ]).join(" ");
}

function buildName(teamName, modelSlug) {
  const modelName = humanizeModel(modelSlug);
  if (!modelName || /^Camisa$/i.test(modelName)) return `Camisa ${teamName}`;
  return `Camisa ${teamName} ${modelName}`;
}

function scoreProduct({ teamSlug, modelSlug, imageCount }) {
  let score = teamPriority[teamSlug] ?? 20;

  if (/2026-27/.test(modelSlug)) score += 80;
  if (/2025-26/.test(modelSlug)) score += 45;
  if (/Player/i.test(modelSlug)) score += 35;
  if (/Casa/i.test(modelSlug)) score += 25;
  if (/Visitante/i.test(modelSlug)) score += 12;
  if (/Especial/i.test(modelSlug)) score += 8;
  if (/Manga-Longa/i.test(modelSlug)) score += 6;
  if (/Retro/i.test(modelSlug)) score -= 45;
  if (/Casual/i.test(modelSlug)) score -= 35;
  if (/^Camisa$/i.test(modelSlug)) score -= 55;
  if (imageCount > 1) score += 5;

  return score;
}

function toPublicPath(sectionDir, teamSlug, folderName, imageName) {
  return `/imagens/${sectionDir}/${teamSlug}/${folderName}/${imageName}`;
}

function toOptimizedPath(sectionDir, teamSlug, folderName, imageName) {
  const extension = path.extname(imageName).toLowerCase().replace(".", "");
  const optimizedName = `${path.basename(
    imageName,
    path.extname(imageName),
  )}.${extension}.webp`;
  return {
    filePath: path.join(
      optimizedImagesRoot,
      sectionDir,
      teamSlug,
      folderName,
      optimizedName,
    ),
    publicPath: `/imagens-otimizadas/${sectionDir}/${teamSlug}/${folderName}/${optimizedName}`,
  };
}

function toProductImagePath(sectionDir, teamSlug, folderName, imageName) {
  const optimized = toOptimizedPath(sectionDir, teamSlug, folderName, imageName);
  if (fs.existsSync(optimized.filePath)) return optimized.publicPath;
  return toPublicPath(sectionDir, teamSlug, folderName, imageName);
}

function collectProducts() {
  const products = [];

  for (const section of sections) {
    const sectionPath = path.join(imagesRoot, section.dir);

    for (const teamSlug of listDirectories(sectionPath)) {
      const teamPath = path.join(sectionPath, teamSlug);
      const teamName = displayTeamName(teamSlug);

      for (const folderName of listDirectories(teamPath)) {
        const productPath = path.join(teamPath, folderName);
        const images = listImages(productPath);

        if (!images.length) continue;

        const modelSlug = getModelSlug(teamSlug, folderName);
        const productName = buildName(teamName, modelSlug);
        const type = inferType(modelSlug);
        const price = defaultPrice;
        const colors = inferColors(modelSlug, folderName);

        products.push({
          categoria: section.category,
          time: teamName,
          nome: productName,
          tipo: type,
          preco: price,
          precoValor: defaultPriceValue,
          precoSegundaCamisa: secondShirtPromotionPrice,
          precoSegundaCamisaValor: secondShirtPromotionPriceValue,
          cores: colors,
          termosBusca: buildSearchTerms({
            sectionDir: section.dir,
            teamSlug,
            teamName,
            category: section.category,
            folderName,
            modelSlug,
            productName,
            type,
            price,
            promotionPrice: secondShirtPromotionPrice,
            colors,
          }),
          brinde: true,
          tamanhos: defaultSizes,
          imagens: images.map((imageName) =>
            toProductImagePath(section.dir, teamSlug, folderName, imageName),
          ),
          _score: scoreProduct({
            teamSlug,
            modelSlug,
            imageCount: images.length,
          }),
        });
      }
    }
  }

  products.sort((a, b) => {
    const scoreDiff = b._score - a._score;
    if (scoreDiff !== 0) return scoreDiff;

    const categoryDiff = a.categoria.localeCompare(b.categoria, "pt-BR");
    if (categoryDiff !== 0) return categoryDiff;

    const teamDiff = a.time.localeCompare(b.time, "pt-BR");
    if (teamDiff !== 0) return teamDiff;

    return a.nome.localeCompare(b.nome, "pt-BR");
  });

  const highlightIndexes = new Set();
  const highlightedTeams = new Set();

  for (const [index, product] of products.entries()) {
    if (highlightIndexes.size >= 12) break;
    if (highlightedTeams.has(product.time)) continue;

    highlightIndexes.add(index);
    highlightedTeams.add(product.time);
  }

  if (highlightIndexes.size < 12) {
    for (const [index] of products.entries()) {
      if (highlightIndexes.size >= 12) break;
      highlightIndexes.add(index);
    }
  }

  return products.map((product, index) => {
    const { _score, ...publicProduct } = product;
    return {
      id: index + 1,
      ...publicProduct,
      destaque: highlightIndexes.has(index),
    };
  });
}

function writeProducts(products) {
  const content = [
    "// Arquivo gerado por scripts/sync-products.mjs a partir de public/imagens.\n",
    "export const products = ",
    JSON.stringify(products, null, 2),
    ";\n",
  ].join("");

  fs.writeFileSync(outputFile, content);
}

const products = collectProducts();
writeProducts(products);

console.log(
  `Catálogo sincronizado: ${products.length} produtos em ${path.relative(
    projectRoot,
    outputFile,
  )}`,
);
