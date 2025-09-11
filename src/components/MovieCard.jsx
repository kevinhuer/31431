import React from "react";
import { formatLongDate, PLACEHOLDER_COVER } from "../data/movies.js";

export default function MovieCard({ movie, accent = false }) {
  return (
    <article
      className={`grid md:grid-cols-3 gap-4 rounded-2xl border ${
        accent
          ? "border-emerald-700/40 bg-emerald-900/10"
          : "border-zinc-800 bg-zinc-900"
      } p-4`}
    >
      <div className="relative overflow-hidden rounded-xl border border-zinc-800">
        <img
          src={movie.cover || PLACEHOLDER_COVER}
          alt={`${movie.title} cover`}
          className="w-full h-full object-cover max-h-72"
        />
      </div>
      <div className="md:col-span-2 flex flex-col">
        <div className="flex items-center justify-between gap-3">
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
              className="inline-flex items-center rounded-lg border border-emerald-700/40 bg-emerald-800/20 px-3 py-1.5 text-sm text-emerald-300 hover:bg-emerald-800/30"
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
