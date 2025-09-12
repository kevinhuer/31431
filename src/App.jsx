import React, { useEffect, useState, useMemo } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { buildCalendar, MOVIES } from "./data/movies.js";
import MovieCard from "./components/MovieCard.jsx";
import CalendarGrid from "./components/CalendarGrid.jsx";
import Footer from "./components/Footer.jsx";
import Popup from "./components/Popup.jsx";

const EVENT_VIDEO_URL = "https://www.youtube.com/embed/D9OoGhS5ilE";

export default function App() {
  const INTRO_KEY = "introDismissed_v1";
  const [enriched, setEnriched] = useState({});
  const [modalOpen, setModalOpen] = useState(
    localStorage.getItem(INTRO_KEY) ? false : true
  );

  const { weeks } = useMemo(() => buildCalendar(2025, 9), []);

  const handleCloseForever = () => {
    setModalOpen(false);
    localStorage.setItem(INTRO_KEY, "1");
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const navigate = useNavigate();
  const handleBackToCalendar = () => {
    navigate("/");
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

  function MovieRoute() {
    const { date } = useParams();
    const base = MOVIES.find((m) => m.date === date);
    const movie = enriched[date] || base;
    if (!movie) return null;
    return (
      <section id="movie">
        <MovieCard movie={movie} onBack={handleBackToCalendar} />
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 w-full">
      <Popup
        open={modalOpen}
        handleClose={handleClose}
        handleCloseForever={handleCloseForever}
        videoURL={EVENT_VIDEO_URL}
      />

      <Routes>
        <Route
          path="/"
          element={
            <section id="calendar" className="mx-auto max-w-6xl px-4 py-6">
              <CalendarGrid enriched={enriched} weeks={weeks} />
            </section>
          }
        />
        <Route path="/movie/:date" element={<MovieRoute />} />
      </Routes>

      <Footer />
    </div>
  );
}
