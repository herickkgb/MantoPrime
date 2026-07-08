import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoot = path.join(projectRoot, "public", "imagens");
const outputRoot = path.join(projectRoot, "public", "imagens-otimizadas");
const extensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const maxDimension = Number(process.env.IMAGE_MAX_DIMENSION) || 1400;
const quality = Number(process.env.WEBP_QUALITY) || 84;
const concurrency = Number(process.env.IMAGE_OPTIMIZE_CONCURRENCY) || 4;

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function* walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* walkFiles(entryPath);
      continue;
    }

    if (entry.isFile() && extensions.has(path.extname(entry.name).toLowerCase())) {
      yield entryPath;
    }
  }
}

function optimizedPathFor(sourcePath) {
  const relativePath = path.relative(sourceRoot, sourcePath);
  const parsed = path.parse(relativePath);
  const sourceExtension = parsed.ext.toLowerCase().replace(".", "");
  return path.join(outputRoot, parsed.dir, `${parsed.name}.${sourceExtension}.webp`);
}

async function shouldSkip(sourcePath, outputPath) {
  if (!(await pathExists(outputPath))) return false;

  const [sourceStats, outputStats] = await Promise.all([
    fs.stat(sourcePath),
    fs.stat(outputPath),
  ]);

  return outputStats.mtimeMs >= sourceStats.mtimeMs;
}

async function optimizeImage(sourcePath) {
  const outputPath = optimizedPathFor(sourcePath);

  if (await shouldSkip(sourcePath, outputPath)) {
    return { status: "skipped" };
  }

  const sourceStats = await fs.stat(sourcePath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  const tempPath = `${outputPath}.tmp-${process.pid}`;
  const image = sharp(sourcePath, { animated: false }).rotate();
  const metadata = await image.metadata();
  const needsResize =
    (metadata.width ?? 0) > maxDimension || (metadata.height ?? 0) > maxDimension;

  let pipeline = image;
  if (needsResize) {
    pipeline = pipeline.resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  await pipeline
    .webp({
      quality,
      effort: 4,
      smartSubsample: true,
    })
    .toFile(tempPath);

  const outputStats = await fs.stat(tempPath);

  if (outputStats.size >= sourceStats.size * 0.98) {
    await fs.rm(tempPath, { force: true });
    await fs.rm(outputPath, { force: true });
    return {
      status: "not-smaller",
      sourceBytes: sourceStats.size,
      outputBytes: sourceStats.size,
    };
  }

  await fs.rename(tempPath, outputPath);

  return {
    status: "optimized",
    sourceBytes: sourceStats.size,
    outputBytes: outputStats.size,
  };
}

async function runPool(files) {
  const stats = {
    optimized: 0,
    skipped: 0,
    notSmaller: 0,
    failed: 0,
    sourceBytes: 0,
    outputBytes: 0,
  };
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < files.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      const sourcePath = files[currentIndex];
      try {
        const result = await optimizeImage(sourcePath);

        if (result.status === "optimized") {
          stats.optimized += 1;
          stats.sourceBytes += result.sourceBytes;
          stats.outputBytes += result.outputBytes;
        } else if (result.status === "skipped") {
          stats.skipped += 1;
        } else {
          stats.notSmaller += 1;
        }
      } catch (error) {
        stats.failed += 1;
        console.warn(`Falha ao otimizar ${path.relative(projectRoot, sourcePath)}:`);
        console.warn(error.message);
      }

      if ((currentIndex + 1) % 100 === 0 || currentIndex + 1 === files.length) {
        console.log(`${currentIndex + 1}/${files.length} imagens verificadas`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, files.length) }, () => worker()),
  );

  return stats;
}

function formatBytes(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

if (!(await pathExists(sourceRoot))) {
  console.log("Nenhuma pasta public/imagens encontrada.");
  process.exit(0);
}

const files = [];
for await (const filePath of walkFiles(sourceRoot)) {
  files.push(filePath);
}

const stats = await runPool(files);
const savedBytes = Math.max(stats.sourceBytes - stats.outputBytes, 0);

console.log(
  [
    `Otimização concluída: ${stats.optimized} geradas`,
    `${stats.skipped} já atualizadas`,
    `${stats.notSmaller} mantidas originais`,
    `${stats.failed} falhas`,
    `economia nesta rodada: ${formatBytes(savedBytes)}`,
  ].join(" | "),
);
