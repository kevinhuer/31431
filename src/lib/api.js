import { PLACEHOLDER_COVER, YEAR_HINTS } from "../data/movies.js";

const TMDB_KEY = import.meta.env.VITE_TMDB_KEY; // required for posters and overviews

function tmdbPosterUrl(path) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : undefined;
}

async function fetchFromTMDB(title, yearHint) {
  if (!TMDB_KEY) return null;
  const params = new URLSearchParams({
    api_key: TMDB_KEY,
    query: title,
    include_adult: "false",
    language: "en-US",
  });
  if (yearHint) params.set("year", String(yearHint));

  const resp = await fetch(
    `https://api.themoviedb.org/3/search/movie?${params.toString()}`
  );
  if (!resp.ok) return null;
  const data = await resp.json();
  const hit = data.results && data.results[0];
  if (!hit) return null;

  // Use search payload directly. No second call.
  return { overview: hit.overview, poster_path: hit.poster_path };
}

export async function enrichMovies(movies) {
  // Fetch in parallel for speed
  const results = await Promise.all(
    movies.map(async (m) => {
      const hint = YEAR_HINTS[m.title];
      const tmdb = await fetchFromTMDB(m.title, hint);
      let cover = tmdbPosterUrl(tmdb && tmdb.poster_path) || m.cover;
      let synopsis = (tmdb && tmdb.overview) || m.synopsis;

      return [
        m.date,
        {
          ...m,
          cover: cover || PLACEHOLDER_COVER,
          synopsis: synopsis || "Synopsis pending.",
        },
      ];
    })
  );
  const map = {};
  for (const [date, item] of results) map[date] = item;
  return map;
}
