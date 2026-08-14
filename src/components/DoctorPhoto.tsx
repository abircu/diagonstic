/** Shared doctor photo with initials fallback when URL missing/broken. */
function initialFromName(name: string) {
  const cleaned = name.replace(/^(dr\.?|ডা\.?)\s+/i, "").trim();
  return (cleaned.charAt(0) || "D").toUpperCase();
}

export function DoctorPhoto({
  url,
  name,
  className = "",
}: {
  url?: string | null;
  name: string;
  className?: string;
}) {
  const initial = initialFromName(name);

  if (url) {
    return (
      <img
        className={`doctor-photo ${className}`.trim()}
        src={url}
        alt={name}
        loading="lazy"
        onError={(e) => {
          const el = e.currentTarget;
          el.style.display = "none";
          const fallback = el.nextElementSibling as HTMLElement | null;
          if (fallback) {
            fallback.hidden = false;
            fallback.textContent = initial;
          }
        }}
      />
    );
  }

  return (
    <div className={`doctor-photo doctor-photo--fallback ${className}`.trim()} aria-hidden>
      {initial}
    </div>
  );
}
