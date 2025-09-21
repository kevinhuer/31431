import React from "react";

const DESKTOP_SHARE_ENDPOINT = "https://www.facebook.com/sharer/sharer.php";
const MOBILE_SHARE_ENDPOINT = "https://m.facebook.com/sharer.php";

function buildFbShareUrl({ shareUrl, quote }, baseUrl) {
  const u = new URL(baseUrl);
  u.searchParams.set("u", shareUrl);
  if (quote) u.searchParams.set("quote", quote);
  return u.toString();
}

function facebookShareTargets(params) {
  const webShareUrl = buildFbShareUrl(params, DESKTOP_SHARE_ENDPOINT);
  const mobileShareUrl = buildFbShareUrl(params, MOBILE_SHARE_ENDPOINT);
  const deepLinkUrl = `fb://facewebmodal/f?href=${encodeURIComponent(mobileShareUrl)}`;
  return { webShareUrl, deepLinkUrl };
}

export function FacebookShareButton({ dateISO, title }) {
  const shareParams = {
    shareUrl: `${window.location.origin}/share/${dateISO}.html`,
    quote: `I watched ${title} on ${dateISO}!`,
  };
  const { webShareUrl, deepLinkUrl } = facebookShareTargets(shareParams);

  return (
    <button
      type="button"
      onClick={() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          let fallbackTimeout;
          const handleVisibilityChange = () => {
            if (document.hidden && fallbackTimeout) {
              clearTimeout(fallbackTimeout);
              document.removeEventListener("visibilitychange", handleVisibilityChange);
            }
          };

          document.addEventListener("visibilitychange", handleVisibilityChange);

          fallbackTimeout = window.setTimeout(() => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.location.href = webShareUrl;
          }, 500);

          window.location.href = deepLinkUrl;
          return;
        }

        window.open(webShareUrl, "_blank", "noopener,noreferrer");
      }}
      className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 hover:bg-zinc-700"
      title="Share on Facebook"
    >
      Share on Facebook
    </button>
  );
}
