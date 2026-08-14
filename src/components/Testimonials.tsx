import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";
import { asLocalized, fetchTestimonials } from "../services/content";
import { localized, useLang } from "../hooks/useLang";
import "./Testimonials.css";

export function Testimonials() {
  const { t } = useTranslation();
  const lang = useLang();
  const [items, setItems] = useState<Awaited<ReturnType<typeof fetchTestimonials>>>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTestimonials()
      .then(setItems)
      .catch((err: unknown) => setLoadError(err instanceof Error ? err.message : "Failed"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
      setAnimKey((k) => k + 1);
    }, 5000);
    return () => window.clearInterval(id);
  }, [paused, items.length]);

  const go = (next: number) => {
    if (!items.length) return;
    setIndex((next + items.length) % items.length);
    setAnimKey((k) => k + 1);
  };

  const item = items[index];

  return (
    <Reveal>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{t("home.testimonials")}</h2>
          </div>
          {loadError ? <p className="empty-note">{loadError}</p> : null}
          {loading ? (
            <p className="empty-note">{t("common.loading")}</p>
          ) : !item ? (
            <p className="empty-note">{t("common.empty")}</p>
          ) : (
            <div
              className="testimonial-shell"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <figure key={animKey} className="testimonial is-animating">
                <blockquote>“{localized(asLocalized(item.quote), lang)}”</blockquote>
                <figcaption>— {localized(asLocalized(item.author), lang)}</figcaption>
              </figure>
              <div className="testimonial-controls">
                <button type="button" aria-label="Previous" onClick={() => go(index - 1)}>
                  ‹
                </button>
                <button type="button" onClick={() => setPaused((p) => !p)}>
                  {paused ? "Play" : "Pause"}
                </button>
                <button type="button" aria-label="Next" onClick={() => go(index + 1)}>
                  ›
                </button>
                <div className="dots" role="tablist" aria-label="Testimonials">
                  {items.map((tm, i) => (
                    <button
                      key={tm.id}
                      type="button"
                      aria-label={`Show testimonial ${i + 1}`}
                      className={i === index ? "active" : ""}
                      onClick={() => {
                        setIndex(i);
                        setAnimKey((k) => k + 1);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </Reveal>
  );
}
