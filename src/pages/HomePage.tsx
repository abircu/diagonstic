import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { CSSProperties } from "react";
import { CountUp } from "../components/CountUp";
import { Carousel } from "../components/Carousel";
import { Reveal } from "../components/Reveal";
import { Testimonials } from "../components/Testimonials";
import { Seo } from "../seo/Seo";
import { orgJsonLd } from "../seo/jsonLd";
import { media } from "../assets/media";
import { useAsyncData } from "../hooks/useAsyncData";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { asLocalized, fetchSpecialties, fetchStats, fetchTherapies } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";
import "./Home.css";

const specialtyImages = [media.diagnostic.one, media.diagnostic.two, media.diagnostic.three];

export function HomePage() {
  const { t } = useTranslation();
  const lang = useLang();
  const link = (path: string) => langPath(lang, path);
  const { site } = useSiteSettings();
  const { data: stats, loading: statsLoading } = useAsyncData(() => fetchStats(), []);
  const { data: specialties, loading: specLoading } = useAsyncData(() => fetchSpecialties(), []);
  const { data: therapies, loading: therapyLoading } = useAsyncData(() => fetchTherapies(), []);

  const featuredTherapies = (therapies ?? []).filter((x) => x.featured).slice(0, 3);

  const heroSlides = [
    { id: "h1", image: media.diagnostic.one },
    { id: "h2", image: media.school.one },
    { id: "h3", image: media.diagnostic.two },
    { id: "h4", image: media.school.two },
    { id: "h5", image: media.diagnostic.three },
    { id: "h6", image: media.diagnostic.four },
  ];

  const showcaseSlides = [
    { id: "s1", image: media.diagnostic.one, title: t("nav.diagnostics") },
    { id: "s2", image: media.diagnostic.two, title: t("home.featuredMedical") },
    { id: "s3", image: media.diagnostic.three, title: t("medical.diagnosticsTitle") },
    { id: "s4", image: media.diagnostic.four, title: t("medical.title") },
    { id: "s5", image: media.school.one, title: t("home.autismHub") },
    { id: "s6", image: media.school.two, title: t("nav.activities") },
  ];

  return (
    <>
      <Seo
        title={t("seo.homeTitle")}
        description={t("seo.homeDesc")}
        lang={lang}
        path=""
        jsonLd={orgJsonLd(lang, site)}
      />

      <section className="home-hero-wrap">
        <Carousel
          variant="hero"
          slides={heroSlides}
          interval={5000}
          overlay={
            <div className="container home-hero-layout">
              <div className="home-hero-inner home-hero-copy">
                <p className="home-brand">{site.brand || t("brand.name")}</p>
                <h1>{t("home.headline")}</h1>
                <p className="home-sub">{t("home.sub")}</p>
                <div className="btn-row">
                  <Link className="btn btn-primary" to={link("/appointment")}>
                    {t("home.ctaAppoint")}
                  </Link>
                  <Link className="btn btn-ghost" to={link("/assessment")}>
                    {t("home.ctaAssess")}
                  </Link>
                </div>
              </div>
            </div>
          }
        />
      </section>

      <Reveal>
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>{t("home.hubsTitle")}</h2>
              <p>{t("home.hubsSub")}</p>
            </div>
            <div className="hub-strip stagger">
              <Reveal className="reveal-scale" delay={0}>
                <Link to={link("/medical")} className="hub-panel medical">
                  <div className="hub-panel-media">
                    <img src={media.diagnostic.four} alt="" loading="lazy" />
                  </div>
                  <div className="hub-panel-body">
                    <h3>{t("home.medicalHub")}</h3>
                    <p>{t("home.medicalHubText")}</p>
                    <span>{t("common.readMore")} →</span>
                  </div>
                </Link>
              </Reveal>
              <Reveal className="reveal-scale" delay={120}>
                <Link to={link("/autism")} className="hub-panel autism">
                  <div className="hub-panel-media">
                    <img src={media.school.one} alt="" loading="lazy" />
                  </div>
                  <div className="hub-panel-body">
                    <h3>{t("home.autismHub")}</h3>
                    <p>{t("home.autismHubText")}</p>
                    <span>{t("common.readMore")} →</span>
                  </div>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section stats-section">
          <div className="container stats-grid">
            {statsLoading ? (
              <p className="empty-note">{t("common.loading")}</p>
            ) : (
              (stats ?? []).map((s) => (
                <div key={s.id} className="stat">
                  <strong>
                    <CountUp value={s.value} suffix={s.suffix} />
                  </strong>
                  <span>{localized(asLocalized(s.label), lang)}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </Reveal>

      <Reveal className="reveal-scale">
        <section className="section showcase-section">
          <div className="container">
            <div className="section-head">
              <h2>{t("gallery.title")}</h2>
              <p>{t("gallery.sub")}</p>
            </div>
            <Carousel variant="gallery" slides={showcaseSlides} interval={4000} />
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>{t("home.featuredMedical")}</h2>
            </div>
            {specLoading ? (
              <p className="empty-note">{t("common.loading")}</p>
            ) : (
              <div className="card-grid cols-3">
                {(specialties ?? []).slice(0, 3).map((s, i) => (
                  <Reveal key={s.slug} delay={i * 100} className="reveal-scale">
                    <article className="surface-card media-card">
                      <img src={specialtyImages[i % specialtyImages.length]} alt="" loading="lazy" />
                      <div className="media-card-body">
                        <h3>{localized(asLocalized(s.name), lang)}</h3>
                        <p>{localized(asLocalized(s.summary), lang)}</p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
            <div className="section-head" style={{ marginTop: "var(--space-7)" }}>
              <h2>{t("home.featuredTherapy")}</h2>
            </div>
            {therapyLoading ? (
              <p className="empty-note">{t("common.loading")}</p>
            ) : (
              <div className="card-grid cols-3">
                {featuredTherapies.map((th, i) => (
                  <Reveal key={th.slug} delay={i * 100} className="reveal-scale">
                    <article className="surface-card media-card">
                      <img src={i % 2 === 0 ? media.school.one : media.school.two} alt="" loading="lazy" />
                      <div className="media-card-body">
                        <h3>
                          <Link className="title-link" to={link(`/therapy/${th.slug}`)}>
                            {localized(asLocalized(th.name), lang)}
                          </Link>
                        </h3>
                        <p>{localized(asLocalized(th.summary), lang)}</p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="section pathway-section">
          <div className="container">
            <div className="section-head">
              <h2>{t("home.pathwayTitle")}</h2>
              <p>{t("home.pathwaySub")}</p>
            </div>
            <ol className="pathway">
              <li>
                <span>1</span>
                <div>
                  <h3>{t("home.step1")}</h3>
                  <p>{t("home.step1Text")}</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <h3>{t("home.step2")}</h3>
                  <p>{t("home.step2Text")}</p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <h3>{t("home.step3")}</h3>
                  <p>{t("home.step3Text")}</p>
                </div>
              </li>
            </ol>
          </div>
        </section>
      </Reveal>

      <Testimonials />

      <Reveal>
        <section className="section">
          <div
            className="container final-cta final-cta--photo"
            style={{ "--cta-image": `url(${media.diagnostic.four})` } as CSSProperties}
          >
            <h2>{t("home.finalCta")}</h2>
            <p>{t("home.finalCtaText")}</p>
            <div className="btn-row">
              <Link className="btn btn-primary" to={link("/appointment")}>
                {t("home.ctaAppoint")}
              </Link>
              <Link className="btn btn-secondary" to={link("/assessment")}>
                {t("home.ctaAssess")}
              </Link>
              <a className="btn btn-ghost" href={`tel:${site.phones.main}`}>
                {site.phones.mainDisplay}
              </a>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
