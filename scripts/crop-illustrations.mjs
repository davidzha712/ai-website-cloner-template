#!/usr/bin/env node
/**
 * Crop the 5 PageSection illustrations out of the full-page desktop screenshot
 * captured during Phase 1 recon. Writes to public/images/illustrations/.
 *
 * Coordinates were extracted via chrome-devtools MCP from getBoundingClientRect()
 * at viewport 1440x900. See docs/research/all-content.json.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "docs/design-references/home-desktop-1440.webp";
const OUT_DIR = "public/images/illustrations";

const crops = [
  // 5 product PageSection illustrations
  { name: "01-make-ops-self-driving.webp", top: 2843, height: 626 },
  { name: "02-define-direction.webp",      top: 4059, height: 618 },
  { name: "03-move-work-forward.webp",     top: 5268, height: 546 },
  { name: "04-review-prs.webp",            top: 6433, height: 584 },
  { name: "05-understand-progress.webp",   top: 7516, height: 598 },
  // Hero app mockup (the rich Linear UI screenshot)
  { name: "hero-app-mockup.webp",          top: 528,  height: 768 },
  // Benefits row (3-col FIG cards)
  { name: "benefits-row.webp",             top: 1812, height: 468 },
  // Changelog area
  { name: "changelog-row.webp",            top: 8496, height: 422 },
];

await mkdir(OUT_DIR, { recursive: true });

const meta = await sharp(SRC).metadata();
const fullWidth = meta.width;
console.log(`source: ${meta.width}x${meta.height}`);

for (const c of crops) {
  const outPath = `${OUT_DIR}/${c.name}`;
  await sharp(SRC)
    .extract({ left: 0, top: c.top, width: fullWidth, height: c.height })
    .webp({ quality: 88 })
    .toFile(outPath);
  console.log(`✓ ${outPath} (${fullWidth}x${c.height})`);
}
