
import React from 'react';

export default function Footer(){
    return(
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
    )
}