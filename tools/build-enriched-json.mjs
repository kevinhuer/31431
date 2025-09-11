import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Resolve project root from this script location
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, ".."); // parent of tools/

// Load env: prefer .env.local, then .env
async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}
const envLocalPath = path.join(ROOT, ".env.local");
const envPath = path.join(ROOT, ".env");
if (await fileExists(envLocalPath)) dotenv.config({ path: envLocalPath });
else if (await fileExists(envPath)) dotenv.config({ path: envPath });
else dotenv.config();

// Support both TMDB_KEY and VITE_TMDB_KEY
const TMDB_KEY = process.env.TMDB_KEY || process.env.VITE_TMDB_KEY;
const OMDB_KEY = process.env.OMDB_KEY || process.env.VITE_OMDB_KEY;

if (!TMDB_KEY) {
  console.error("Missing TMDB_KEY in env. Add TMDB_KEY to .env.local at the project root.");
  process.exit(1);
}

// Use Node 18 global fetch if present, else polyfill
const fetchImpl = globalThis.fetch || (await import("node-fetch")).default;

const moviesPath = path.join(ROOT, "src", "data", "movies.list.json");
const hintsPath  = path.join(ROOT, "src", "data", "yearHints.json");
const outPath    = path.join(ROOT, "public", "movies.enriched.json");

const movies = JSON.parse(await fs.readFile(moviesPath, "utf8"));
const YEAR_HINTS = JSON.parse(await fs.readFile(hintsPath, "utf8"));

function tmdbPosterUrl(p) {
  return p ? `https://image.tmdb.org/t/p/w500${p}` : undefined;
}

async function fetchFromTMDB(title, yearHint) {
  const params = new URLSearchParams({
    api_key: TMDB_KEY,
    query: title,
    include_adult: "false",
    language: "en-US"
  });
  if (yearHint) params.set("year", String(yearHint));

  const resp = await fetchImpl(`https://api.themoviedb.org/3/search/movie?${params.toString()}`);
  if (!resp.ok) return null;
  const data = await resp.json();
  const hit = data.results && data.results[0];
  if (!hit) return null;
  return { overview: hit.overview, poster_path: hit.poster_path };
}

async function fetchFromOMDb(title, yearHint) {
  if (!OMDB_KEY) return null;
  const params = new URLSearchParams({ apikey: OMDB_KEY, t: title, type: "movie", plot: "short" });
  if (yearHint) params.set("y", String(yearHint));
  const resp = await fetchImpl(`https://www.omdbapi.com/?${params.toString()}`);
  if (!resp.ok) return null;
  const data = await resp.json();
  if (!data || data.Response === "False") return null;
  return { overview: data.Plot, poster: data.Poster };
}

async function enrichOne(m) {
  const hint = YEAR_HINTS[m.title];
  const tmdb = await fetchFromTMDB(m.title, hint);
  let cover = tmdb && tmdb.poster_path ? tmdbPosterUrl(tmdb.poster_path) : m.cover;
  let synopsis = (tmdb && tmdb.overview) || m.synopsis;

  if (!synopsis) {
    const omdb = await fetchFromOMDb(m.title, hint);
    synopsis = (omdb && omdb.overview) || synopsis;
    cover = cover || (omdb && omdb.poster) || cover;
  }

  return { ...m, cover, synopsis: synopsis || "Synopsis pending." };
}

const results = await Promise.all(movies.map(enrichOne));
const byDate = Object.fromEntries(results.map((m) => [m.date, m]));
await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, JSON.stringify(byDate, null, 2));
console.log(`Wrote ${outPath}`);