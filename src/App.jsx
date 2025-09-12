import React, { useEffect, useState, useMemo, useReducer } from "react";
import { buildCalendar } from "./data/movies.js";
import MovieCard from "./components/MovieCard.jsx";
import CalendarGrid from "./components/CalendarGrid.jsx";
import Footer from "./components/Footer.jsx";
import Popup from "./components/Popup.jsx";
import { calendarReducer, initialState } from "./state/calendarReducer.js";

const EVENT_VIDEO_URL = "https://www.youtube.com/embed/D9OoGhS5ilE"; 

export default function App() {

  const INTRO_KEY = "introDismissed_v1";
  const [enriched, setEnriched] = useState({}); // { [date]: movie }
  const [modalOpen, setModalOpen] = useState(localStorage.getItem(INTRO_KEY) ? false : true);
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  const { weeks } = useMemo(() => buildCalendar(2025, 9), []); // 9 = October

  const handleCloseForever = () =>{
     setModalOpen(false);
     localStorage.setItem(INTRO_KEY, "1");
  }

  const { view, movie } = state;
  const isMovieView = view === "movie";
  const selectedMovie = movie;

  const handleClose = () => {
    setModalOpen(false);
  };

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
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, []);

 

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 w-full">
      <Popup open={modalOpen} handleClose={handleClose} handleCloseForever={handleCloseForever} videoURL={EVENT_VIDEO_URL} />

      {/* Calendar */}
  
        <section id="calendar" className="mx-auto max-w-6xl px-4 py-6">
          <CalendarGrid
            enriched={enriched}
            weeks={weeks}
            dispatch={dispatch}
          />
        </section>
     

      {selectedMovie && isMovieView && (
        <section id="movie">
          <MovieCard
            movie={movie}
            dispatch={dispatch}
          />
        </section>
      )}

      <Footer />
    </div>
  );
}
