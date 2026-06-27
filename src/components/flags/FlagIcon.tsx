type FlagIconProps = {
  code: "fr" | "gb";
  className?: string;
};

export function FlagIcon({ code, className = "h-3.5 w-[1.3125rem] shrink-0 rounded-[2px]" }: FlagIconProps) {
  if (code === "fr") {
    return (
      <svg
        viewBox="0 0 3 2"
        aria-hidden
        className={`overflow-hidden border border-white/10 shadow-sm ${className}`}
      >
        <rect width="1" height="2" fill="#002395" />
        <rect x="1" width="1" height="2" fill="#ffffff" />
        <rect x="2" width="1" height="2" fill="#ed2939" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 60 30"
      aria-hidden
      className={`overflow-hidden border border-white/10 shadow-sm ${className}`}
    >
      <clipPath id={`uk-flag-clip-${code}`}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <g clipPath={`url(#uk-flag-clip-${code})`}>
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
