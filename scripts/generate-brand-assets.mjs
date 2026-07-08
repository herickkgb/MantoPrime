import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicRoot = path.join(projectRoot, "public");

const colors = {
  navy: "#0b1220",
  navySoft: "#101827",
  gold: "#d4af37",
  emerald: "#10b981",
  white: "#ffffff",
  muted: "#d8dee8",
};

function iconSvg(size) {
  const border = Math.round(size * 0.06);
  const radius = Math.round(size * 0.18);
  const fontSize = Math.round(size * 0.29);

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${colors.navy}"/>
      <rect
        x="${border}"
        y="${border}"
        width="${size - border * 2}"
        height="${size - border * 2}"
        rx="${radius}"
        fill="${colors.navySoft}"
        stroke="${colors.gold}"
        stroke-width="${Math.max(4, Math.round(size * 0.025))}"
      />
      <text
        x="50%"
        y="54%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="${colors.gold}"
        font-family="Impact, Arial Narrow, Arial, Helvetica, sans-serif"
        font-size="${fontSize}"
        font-weight="900"
      >BH</text>
    </svg>
  `;
}

function ogImageSvg() {
  return `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="78" height="78" patternUnits="userSpaceOnUse">
          <path d="M 78 0 L 0 0 0 78" fill="none" stroke="#172238" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="1200" height="630" fill="${colors.navy}"/>
      <rect width="1200" height="630" fill="url(#grid)" opacity="0.75"/>
      <path d="M780 80 L1200 -4 L1200 630 L1040 630 Z" fill="${colors.navySoft}" opacity="0.82"/>
      <rect x="74" y="84" width="98" height="98" rx="18" fill="#101827" stroke="${colors.gold}" stroke-width="4"/>
      <text x="123" y="139" dominant-baseline="middle" text-anchor="middle" fill="${colors.gold}" font-family="Impact, Arial Narrow, Arial, Helvetica, sans-serif" font-size="42" font-weight="900">BH</text>
      <text x="76" y="298" fill="${colors.white}" font-family="Impact, Arial Narrow, Arial, Helvetica, sans-serif" font-size="92" font-weight="900">BH-Mantos</text>
      <text x="80" y="354" fill="${colors.muted}" font-family="Arial, Helvetica, sans-serif" font-size="34">Camisas de futebol em BH e região</text>
      <rect x="78" y="402" width="400" height="60" rx="10" fill="${colors.emerald}"/>
      <text x="278" y="441" dominant-baseline="middle" text-anchor="middle" fill="${colors.white}" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800">Ver catálogo mobile</text>
      <text x="78" y="535" fill="${colors.gold}" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800">Loja física em Santa Luzia - MG</text>
      <g transform="translate(705 116)">
        <path d="M58 44 L146 12 L196 58 L246 12 L334 44 L392 178 L318 224 L300 392 L92 392 L74 224 L0 178 Z" fill="#f9fafb"/>
        <path d="M148 64 Q148 114 196 114 Q244 114 244 64" fill="none" stroke="${colors.gold}" stroke-width="5"/>
        <rect x="132" y="82" width="24" height="304" rx="12" fill="${colors.navy}"/>
        <rect x="186" y="82" width="24" height="304" rx="12" fill="${colors.navy}"/>
        <rect x="240" y="82" width="24" height="304" rx="12" fill="${colors.navy}"/>
        <path d="M74 224 L92 392 L300 392 L318 224" fill="none" stroke="#e5e7eb" stroke-width="8" opacity="0.55"/>
      </g>
    </svg>
  `;
}

async function writePng(svg, outputPath, size) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await sharp(Buffer.from(svg))
    .resize(size ? { width: size, height: size } : undefined)
    .png()
    .toFile(outputPath);
}

await writePng(iconSvg(192), path.join(publicRoot, "icons", "icon-192.png"), 192);
await writePng(iconSvg(512), path.join(publicRoot, "icons", "icon-512.png"), 512);
await writePng(ogImageSvg(), path.join(publicRoot, "og-image.png"));

console.log("Assets da marca BH-Mantos gerados.");
