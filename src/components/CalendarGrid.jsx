import React from "react";
import MovieCard from "./MovieCard.jsx";
import { MOVIES } from "../data/movies.js";

export default function CalendarGrid({
  enriched,
  weeks,
  handleSetSelectedDate,
}) {
  return (
    <>
      <div>
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-xl sm:text-2xl font-semibold">
            October 2025 Calendar
          </h2>
          <div className="text-zinc-400 text-xs">
            Click a day to view details
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs sm:text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2 font-medium text-zinc-300">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weeks.map((week, wi) => (
          <React.Fragment key={wi}>
            {week.map((day, di) => {
              const iso = day.toISOString().slice(0, 10);
              const inMonth = day.getMonth() === 9; // October
              const base = MOVIES.find((m) => m.date === iso);
              const movie = inMonth ? enriched[iso] || base : undefined;
              const isToday = iso === new Date().toISOString().slice(0, 10);

              return (
                <button
                  key={di}
                  onClick={() => {
                    if (inMonth && movie) {
                      handleSetSelectedDate(iso, movie);
                    }
                  }}
                  className={[
                    "rounded-xl border px-2 py-2 text-left h-28 sm:h-32 transition",
                    inMonth
                      ? "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
                      : "border-transparent bg-zinc-900/30 text-zinc-600",
                    movie ? "cursor-pointer" : "cursor-default",
                    isToday ? "ring-2 ring-emerald-500" : "",
                  ].join(" ")}
                  disabled={!inMonth || !movie}
                  title={movie?.title || "No feature"}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      {day.getDate()}
                    </span>
                    {isToday && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600/20 text-emerald-300">
                        today
                      </span>
                    )}
                  </div>
                  <div className="mt-2 line-clamp-3 text-xs sm:text-sm text-zinc-200 hidden lg:block">
                    {movie ? movie.title : ""}
                  </div>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
