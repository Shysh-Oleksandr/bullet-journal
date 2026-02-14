import sharp from "sharp";
import { mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

const sizes = [192, 512];
const buffer = await sharp({
  create: { width: 512, height: 512, channels: 3, background: { r: 30, g: 58, b: 138 } },
})
  .png()
  .toBuffer();

for (const size of sizes) {
  await sharp(buffer).resize(size, size).png().toFile(join(publicDir, `icon-${size}x${size}.png`));
  console.log(`Created icon-${size}x${size}.png`);
}
