import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const items = JSON.parse(
  await readFile(path.join(root, "src/data/prompts.json"), "utf8"),
);
const ids = new Set();
let images = 0;
for (const item of items) {
  if (ids.has(item.id)) throw new Error(`Duplicate prompt ID: ${item.id}`);
  ids.add(item.id);
  if (
    !item.title ||
    !item.prompt.trim() ||
    !item.category ||
    !item.images.length
  )
    throw new Error(`Incomplete entry: ${item.id}`);
  for (const image of item.images) {
    for (const src of [image.src, image.thumbnail]) {
      if (!src.startsWith("/images/") || src.includes(".."))
        throw new Error(`Invalid local image path: ${src}`);
      await access(path.join(root, "public", src));
    }
    if (image.width <= 0 || image.height <= 0)
      throw new Error(`Invalid image dimensions: ${item.id}`);
    images++;
  }
  if (item.sourceUrl && !/^https:\/\//.test(item.sourceUrl))
    throw new Error(`Invalid source URL: ${item.id}`);
}
console.log(
  `Content verified: ${items.length} prompts, ${images} images, ${new Set(items.map((item) => item.category)).size} categories; every image and prompt is present.`,
);
