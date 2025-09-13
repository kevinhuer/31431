import React from "react";

function fbShareUrl({ shareUrl, quote }) {
  const u = new URL("https://www.facebook.com/sharer/sharer.php");
  u.searchParams.set("u", shareUrl);
  if (quote) u.searchParams.set("quote", quote);
  return u.toString();
}

export function FacebookShareButton({ dateISO, title }) {
  const shareUrl = `${window.location.origin}/share/${dateISO}.html`;
  const quote = `I watched ${title} on ${dateISO}!`;
  return (
    <button
      type="button"
      onClick={() => window.open(fbShareUrl({ shareUrl, quote }), "_blank", "noopener,noreferrer")}
      className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 hover:bg-zinc-700"
      title="Share on Facebook"
    >
      Share on Facebook
    </button>
  );
}