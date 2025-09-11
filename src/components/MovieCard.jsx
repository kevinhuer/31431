import React from "react";
import { formatLongDate, PLACEHOLDER_COVER } from "../data/movies.js";

export default function MovieCard({
  movie,
  accent = false,
  handleBackToCalendar,
}) {
  return (
    <article
      role="dialog"
      aria-modal="true"
      aria-label="About this movie"
      className={`fixed inset-0 z-50 w-[min(92vw,1000px)] rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl movie-card ${
        accent
          ? "border-emerald-700/40 bg-emerald-900/10"
          : "border-zinc-800 bg-zinc-900"
      } p-4`}
    >
      <div className="flex w-full justify-end">
        <button className="" onClick={handleBackToCalendar}>
          Back to calendar
        </button>
      </div>

      <div className="flex flex-col relative overflow-hidden rounded-xl ">
        <img
          src={movie.cover || PLACEHOLDER_COVER}
          alt={`${movie.title} cover`}
          className="relative movie-card-image"
        />
      </div>
      <div className="flex flex-col m">
        <div className="flex flex-wrap items-center justify-between ">
          <h3 className="text-xl font-semibold">{movie.title}</h3>
          <span className="text-xs text-zinc-400 whitespace-nowrap">
            Watch date: {formatLongDate(movie.date)}
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-300 min-h-[3rem]">
          {movie.synopsis || "Synopsis pending."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {movie.tubi ? (
            <a
              href={movie.tubi}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm text-emerald-300 hover:bg-emerald-800/30"
            >
              Watch on Tubi
            </a>
          ) : (
            <a
              href={`https://tubitv.com/search/${encodeURIComponent(
                movie.title
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700"
            >
              Search on Tubi
            </a>
          )}
          <button
            onClick={() => navigator.clipboard.writeText(`${movie.title}`)}
            className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-700"
            title="Copy title"
          >
            Copy title
          </button>
        </div>
      </div>
    </article>
  );
}
