import React, { useEffect, useState, useMemo } from "react";
import { MOVIES, buildCalendar, getTodayMovie } from "./data/movies.js";
import MovieCard from "./components/MovieCard.jsx";
import CalendarGrid from "./components/CalendarGrid.jsx";
import Footer from "./components/Footer.jsx";
import Popup from "./components/Popup.jsx";

const EVENT_VIDEO_URL = "https://www.youtube.com/embed/D9OoGhS5ilE"; 

export default function App() {

  const INTRO_KEY = "introDismissed_v1";
  const [enriched, setEnriched] = useState({}); // { [date]: movie }
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(localStorage.getItem(INTRO_KEY) ? false : true);
  const [selectedDate, setSelectedDate] = useState();
  const [isMovieView, setMovieView] = useState(false);
  const [movie, setMovie] = useState(null);

  const { weeks } = useMemo(() => buildCalendar(2025, 9), []); // 9 = October

  const todayBase = getTodayMovie();
  const today = todayBase ? enriched[todayBase.date] || todayBase : null;


  const handleCloseForever = () =>{
     setModalOpen(false);
     localStorage.setItem(INTRO_KEY, "1");
  }

  const selectedMovie = selectedDate
    ? enriched[selectedDate] ||
      MOVIES.find((m) => m.date === selectedDate) ||
      null
    : null;


  const handleBackToCalendar = () => {
    setMovieView(false);
  };

  const handleSetSelectDate = (iso, movie) => {
    setSelectedDate(iso);
    setMovie(movie);
    setMovieView(true);
  };

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
      } finally {
        if (alive) setLoading(false);
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
            loading={loading}
            today={today}
            selectedDate={selectedDate}
            weeks={weeks}
            handleSetSelectedDate={handleSetSelectDate}
          />
        </section>
     

      {selectedMovie && isMovieView && (
        <section id="movie">
          <MovieCard
            movie={movie}
            handleBackToCalendar={handleBackToCalendar}
          />
        </section>
      )}

      <Footer />
    </div>
  );
}
