import React, { useEffect, useState, useRef } from "react";
import MovieCard from "./components/MovieCard.jsx";
import CalendarGrid from "./components/CalendarGrid.jsx";
import { MOVIES, getTodayMovie } from "./data/movies.js";

const EVENT_VIDEO_URL = "https://www.youtube.com/embed/D9OoGhS5ilE"; // Replace with your trailer URL

export default function App() {
  const [enriched, setEnriched] = useState({}); // { [date]: movie }
  const [loading, setLoading] = useState(true);
      const headerRef = useRef(null);
  useEffect(() => {
    let alive = true;
    async function run() {
      try {
        const res = await fetch("/movies.enriched.json", { cache: "no-store" });
        if (!res.ok) throw new Error("failed fetch");
        const json = await res.json();
        if (alive) setEnriched(json);
      } catch (e) {
        console.error("Falling back to raw schedule only:", e);
        if (alive) setEnriched({});
      } finally {
        if (alive) setLoading(false);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, []);



  const todayBase = getTodayMovie();
  const today = todayBase ? enriched[todayBase.date] || todayBase : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 w-full">
      <header ref={headerRef} className="sticky top-0 z-10 backdrop-blur bg-zinc-950/70 border-b border-zinc-800">
        <div className="mx-auto w-full px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            31 for 31, October 2025
          </h1>
        </div>
        <section id="video" className="mx-auto max-w-6xl px-4 py-1 sm:py-1">
          <div className="items-start">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">
                THE TERRIBLE NUMBER TWOS!!!!
              </h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                <strong>
                  31 movies that are the 2nd in their series (mostly) AND are
                  also absolute shit AND all are available on TU(two)bi for free
                  (with ads).
                </strong>
              </p>
              <p className="text-zinc-300 text-sm leading-relaxed">
                <strong>Non-stop triple double trouble.</strong>
              </p>
            </div>
          </div>
        </section>
      </header>

      {/* Trailer */}

      {/* Calendar */}
      <section id="calendar" className="mx-auto max-w-6xl px-4 py-6">
        <CalendarGrid enriched={enriched} loading={loading} today={today} />
      </section>

      <footer className="mt-12 border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-zinc-500 space-y-2">
          <p className="text-xs text-zinc-500">
            Data and images from{" "}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noreferrer"
            >
              TMDB
            </a>
            .
          </p>
          <img src="/tmdb.svg" alt="TMDB logo" height="87" width="200" />
        </div>
      </footer>
    </div>
  );
}
