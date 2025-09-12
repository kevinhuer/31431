import React from "react";
import { formatLongDate, PLACEHOLDER_COVER } from "../data/movies.js";
import StarRating from "./StarRating";

export default function MovieCard({
  movie,
  accent = false,
  handleBackToCalendar,
}) {
  function isiOS() {
    return /iP(hone|ad|od)/i.test(navigator.userAgent);
  }

  function isAndroidChrome() {
    const ua = navigator.userAgent || "";
    return (
      /Android/i.test(ua) &&
      /Chrome\/\d+/i.test(ua) &&
      !/Edg/i.test(ua) &&
      !/OPR|Opera/i.test(ua) &&
      !/SamsungBrowser/i.test(ua)
    );
  }

  function toAndroidIntentUrl(webUrl, pkg = "com.tubitv") {
    const u = new URL(webUrl);
    const scheme = u.protocol.replace(":", ""); // "https"
    return (
      `intent://${u.host}${u.pathname}${u.search}${u.hash}` +
      `#Intent;scheme=${scheme};package=${pkg};` +
      `S.browser_fallback_url=${encodeURIComponent(webUrl)};end`
    );
  }

  function openOnTubi(webUrl) {
    if (isAndroidChrome()) {
      const intentUrl = toAndroidIntentUrl(webUrl);
      const start = Date.now();
      window.location.href = intentUrl;
      setTimeout(() => {
        if (Date.now() - start < 1500) window.location.href = webUrl;
      }, 1000);
      return;
    }

    if (isiOS()) {
      // Use same-tab navigation so you don’t leave a blank new tab behind
      window.location.href = webUrl; // or window.location.assign(webUrl)
      return;
    }

    // Other platforms: your choice. Same-tab avoids stray tabs everywhere.
    window.location.href = webUrl;
  }

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
        <button className="appearance-none bg-zinc-900" onClick={handleBackToCalendar}>
          Back to calendar
        </button>
      </div>
      <div className="flex flex-col md:flex-row mt-2">
        <div className="flex flex-col relative rounded-xl mr-0 md:mr-4">
          <img
            src={movie.cover || PLACEHOLDER_COVER}
            alt={`${movie.title} cover`}
            className="relative movie-card-image"
          />
        </div>
        <div className="flex flex-col m">
          <div className="flex flex-wrap items-start justify-between ">
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold">{movie.title}</h3>
              <StarRating
                value={movie.stars}
                size={20}
                className="text-zinc-400" // sets outline color via currentColor
                fillColor="#facc15" // yellow fill
              />
              <span className="text-sm text-emerald-300">
                Release date: {formatLongDate(movie.release)}
              </span>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <span>Watch date: {formatLongDate(movie.date)}</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-zinc-300 min-h-[3rem]">
            {movie.synopsis || "Synopsis pending."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() =>
                openOnTubi(
                  movie.url ||
                    `https://tubitv.com/search/${encodeURIComponent(
                      movie.title
                    )}`
                )
              }
              type="button"
              rel="noreferrer"
              className="appearance-none inline-flex items-center rounded-lg px-3 py-1.5 text-sm text-emerald-300 hover:bg-emerald-800/30"
            >
              Watch on Tubi
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
