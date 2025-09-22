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
  const shareUrls = {
    web: buildFbShareUrl(params, DESKTOP_SHARE_ENDPOINT),
    mobile: buildFbShareUrl(params, MOBILE_SHARE_ENDPOINT),
  };

  return {
    webShareUrl: shareUrls.web,
    deepLinkUrl: `fb://facewebmodal/f?href=${encodeURIComponent(shareUrls.mobile)}`,
  };
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
          let didLoseVisibility = false;

          function cleanup() {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("pagehide", handlePageHide);
            window.removeEventListener("blur", handleBlur);
          }

          function recordVisibilityLoss() {
            didLoseVisibility = true;
            if (fallbackTimeout) {
              clearTimeout(fallbackTimeout);
              fallbackTimeout = undefined;
            }
            cleanup();
          }

          function handleVisibilityChange() {
            if (document.visibilityState === "hidden") {
              recordVisibilityLoss();
            }
          }

          function handlePageHide() {
            recordVisibilityLoss();
          }

          function handleBlur() {
            if (document.visibilityState === "hidden") {
              recordVisibilityLoss();
            }
          }

          document.addEventListener("visibilitychange", handleVisibilityChange);
          window.addEventListener("pagehide", handlePageHide);
          window.addEventListener("blur", handleBlur);

          fallbackTimeout = window.setTimeout(() => {
            fallbackTimeout = undefined;
            cleanup();
            if (!didLoseVisibility && document.visibilityState === "visible") {
              window.location.href = webShareUrl;
            }
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
