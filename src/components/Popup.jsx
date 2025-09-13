import React, { useRef, useEffect } from "react";

export default function Popup({
  open,
  handleClose,
  handleCloseForever,
  videoURL,
  children,
}) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function onKey(e) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="About this event"
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      {/* panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-[min(92vw,1000px)] rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <div className="flex items-start justify-between w-full p-4 sm:p-6">
            <div className="flex w-full flex-row justify-between">
              <button
                ref={closeBtnRef}
                onClick={handleClose}
                className="appearance-none ml-4 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 hover:bg-zinc-700"
                aria-label="Close"
              >
                Close
              </button>
              <button
                onClick={handleCloseForever}
                className="appearance-none ml-4 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 hover:bg-zinc-700"
                aria-label="Close forever"
              >
                Don't open again
              </button>
            </div>
          </div>

          <div className="mx-auto w-full px-4 py-4 flex flex-col items-center justify-center">
            <iframe
              className="w-full h-full sm:w-96 sm:h-64"
                            src={videoURL}
              title="31 for 31 trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
              31 for 31, October 2025
            </h1>
          </div>
          <section id="video" className="mx-auto max-w-6xl px-4 py-1 sm:py-1 w-full h-full sm:w-96 sm:h-64">
            <div className="text-center">
              <div className="space-y-3 ">
                <h2 className="text-xl font-semibold">
                  THE TERRIBLE NUMBER TWOS!!!!
                </h2>
                <p className="text-zinc-300 text-sm leading-relaxed ">
                  <strong>
                    31 movies that are the 2nd in their series (mostly) AND are
                    also absolute sh*t AND all are available on TU(two)bi for
                    free (with ads).
                  </strong>
                </p>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  <strong>Non-stop triple double trouble.</strong>
                </p>
              </div>
            </div>
          </section>
          <div className="px-4 pb-4 sm:px-6 sm:pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
