// tools/build-share-pages.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, ".."); // adjust if your script sits in tools/

const movies = JSON.parse(
  await fs.readFile(path.join(ROOT, "src/data/movies.list.json"), "utf8")
);
const enriched = JSON.parse(
  await fs.readFile(path.join(ROOT, "public/movies.enriched.json"), "utf8")
);

const SITE_BASE = process.env.SITE_BASE || "https://example.com"; 

function shareHtml({ url, title, description, image, dateISO }) {
  const fullUrl = new URL(url, SITE_BASE).toString();
  const imgUrl  = image.startsWith("http") ? image : new URL(image, SITE_BASE).toString();
  const desc    = description || `I watched ${title} on ${dateISO}.`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>

  <title>${title}</title>
  <!-- Open Graph -->
  <meta property="og:type" content="article"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${desc}"/>
  <meta property="og:url" content="${fullUrl}"/>
  <meta property="og:image" content="${imgUrl}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:site_name" content="31 for 31"/>

  <!-- Optional: Twitter cards -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${desc}"/>
  <meta name="twitter:image" content="${imgUrl}"/>

  <!-- Redirect humans to the app -->
  <meta http-equiv="refresh" content="0; url=/${dateISO}?from=share"/>
</head>
<body>
  <p>Redirecting… If not redirected, <a href="/${dateISO}">open the app</a>.</p>
</body>
</html>`;
}

const outDir = path.join(process.cwd(), "public", "share");
await fs.mkdir(outDir, { recursive: true });

for (const m of movies) {
  const dateISO = m.date; // already "YYYY-MM-DD" in your JSON
  const item = enriched[dateISO] || m;
  const image = item.cover || "/posters/fallback.jpg";  // use your prebuilt local poster or a custom banner
  const urlPath = `/share/${dateISO}.html`;

  const html = shareHtml({
    url: urlPath,
    title: `${item.title} — I watched this`,
    description: item.synopsis,
    image,
    dateISO
  });

  await fs.writeFile(path.join(outDir, `${dateISO}.html`), html);
}

console.log("Share pages written to /public/share");
