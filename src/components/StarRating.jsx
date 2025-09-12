import React from "react";

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function StarOutline({ size = 20, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M12 3.3l2.7 5.48 6.05.88-4.38 4.27 1.03 6.02L12 17.9 6.6 19.95l1.03-6.02L3.25 9.66l6.05-.88L12 3.3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.6"
      />
    </svg>
  );
}

function StarSolid({ size = 20, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path
        d="M12 3.3l2.7 5.48 6.05.88-4.38 4.27 1.03 6.02L12 17.9 6.6 19.95l1.03-6.02L3.25 9.66l6.05-.88L12 3.3z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function StarRating({
  value,           // 0..5, halves allowed
  size = 20,
  fillColor = "#facc15",   // amber-400
  outlineColor = "currentColor",
  className = "",
}) {
    if (value === "?") return;
  return (
    <div className={`inline-flex items-center gap-1 ${className}`} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const pct = clamp((value - (i - 1)) * 100, 0, 100); // how much of this star to fill
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            {/* outline star */}
            <span className="absolute inset-0" style={{ color: outlineColor }}>
              <StarOutline size={size} />
            </span>
            {/* filled portion clipped to pct% */}
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${pct}%` }}
              aria-hidden="true"
            >
              <span className="absolute inset-0" style={{ color: fillColor }}>
                <StarSolid size={size} />
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}