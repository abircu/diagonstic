import { useEffect, useState, type ReactNode } from "react";
import "./Carousel.css";

export type CarouselSlide = {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
};

type Props = {
  slides: CarouselSlide[];
  interval?: number;
  variant?: "hero" | "gallery";
  showArrows?: boolean;
  overlay?: ReactNode;
  className?: string;
};

export function Carousel({
  slides,
  interval = 4500,
  variant = "gallery",
  showArrows = true,
  overlay,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, interval);
    return () => window.clearInterval(id);
  }, [paused, count, interval]);

  const go = (next: number) => {
    setIndex((next + count) % count);
  };

  return (
    <div
      className={`carousel carousel--${variant} ${className}`.trim()}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="carousel-track">
        {slides.map((slide, i) => (
          <figure
            key={slide.id}
            className={`carousel-slide${i === index ? " is-active" : ""}`}
            aria-hidden={i !== index}
          >
            <img src={slide.image} alt={slide.title || ""} />
            {(slide.title || slide.subtitle) && (
              <figcaption className="carousel-caption">
                {slide.title ? <strong>{slide.title}</strong> : null}
                {slide.subtitle ? <span>{slide.subtitle}</span> : null}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {overlay ? <div className="carousel-overlay-slot">{overlay}</div> : null}

      {showArrows && count > 1 ? (
        <>
          <button type="button" className="carousel-nav prev" aria-label="Previous slide" onClick={() => go(index - 1)}>
            ‹
          </button>
          <button type="button" className="carousel-nav next" aria-label="Next slide" onClick={() => go(index + 1)}>
            ›
          </button>
        </>
      ) : null}

      {count > 1 ? (
        <div className="carousel-dots" role="tablist" aria-label="Slides">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              className={i === index ? "active" : ""}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}

      <div className="carousel-progress" aria-hidden>
        <span key={`${index}-${paused}`} className={paused ? "is-paused" : ""} style={{ animationDuration: `${interval}ms` }} />
      </div>
    </div>
  );
}
