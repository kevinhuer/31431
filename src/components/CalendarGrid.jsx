import React, { useMemo, useRef, useState, useEffect } from "react";
import MovieCard from "./MovieCard.jsx";
import { MOVIES, buildCalendar } from "../data/movies.js";

export default function CalendarGrid({ enriched, loading, today }) {
  const [selectedDate, setSelectedDate] = useState("2025-10-01");
  const { weeks } = useMemo(() => buildCalendar(2025, 9), []); // 9 = October
  const selectedMovie = selectedDate
    ? enriched[selectedDate] ||
      MOVIES.find((m) => m.date === selectedDate) ||
      null
    : null;
  
    const headerRef = useRef(null);
  const detailsRef = useRef(null);
  
  useEffect(() => {
      if (!selectedDate || !detailsRef.current) return;
  const headerH = headerRef.current?.offsetHeight ?? 0;
  const y = detailsRef.current.getBoundingClientRect().top + window.scrollY - headerH - 12;
  window.scrollTo({ top: y, behavior: "smooth" });
  detailsRef.current.focus();
  }, [selectedDate]);

  return (
    <>
      <div className="mt-6">
        {loading && (
          <div className="text-zinc-400 text-sm mb-3">
            Fetching posters and synopses...
          </div>
        )}
        {selectedMovie ? (
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Selected day: {`${selectedDate}`}
            </h3>

            <section id="today" className="mx-auto max-w-6xl px-4 py-1">
              {today ? (
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                  It's the movie of the DAY!!!!
                </h2>
              ) : (
                <h2>Beginning soon!!!</h2>
              )}
              {today ? (
                <MovieCard movie={today} accent />
              ) : (
                <MovieCard movie={selectedMovie} accent />
              )}
            </section>
          </div>
        ) : (
          <div className="text-zinc-400 text-sm">Pick a date below.</div>
        )}
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
                  onClick={() => inMonth && movie && setSelectedDate(iso)}
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
                  <div className="mt-2 line-clamp-3 text-xs sm:text-sm text-zinc-200">
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
