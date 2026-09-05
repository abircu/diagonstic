import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { CSSProperties } from "react";
import { CountUp } from "../components/CountUp";
import { Carousel } from "../components/Carousel";
import { Reveal } from "../components/Reveal";
import { Testimonials } from "../components/Testimonials";
import { VideoGrid, filterVideosByCategory } from "../components/VideoGrid";
import { Seo } from "../seo/Seo";
import { orgJsonLd } from "../seo/jsonLd";
import { media } from "../assets/media";
import { useAsyncData } from "../hooks/useAsyncData";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { asLocalized, fetchSpecialties, fetchStats, fetchSliders, fetchTherapies, fetchYoutubeVideos } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";
import "./Home.css";
import "./Videos.css";

const specialtyImages = [media.diagnostic.one, media.diagnostic.two, media.diagnostic.three];

const fallbackHeroSlides = [
  { id: "h1", image: media.diagnostic.one },
  { id: "h2", image: media.school.one },
  { id: "h3", image: media.diagnostic.two },
  { id: "h4", image: media.school.two },
  { id: "h5", image: media.diagnostic.three },
  { id: "h6", image: media.diagnostic.four },
];

export function HomePage() {
  const { t } = useTranslation();
  const lang = useLang();
  const link = (path: string) => langPath(lang, path);
  const { site } = useSiteSettings();
  const { data: stats, loading: statsLoading } = useAsyncData(() => fetchStats(), []);
  const { data: specialties, loading: specLoading } = useAsyncData(() => fetchSpecialties(), []);
  const { data: therapies, loading: therapyLoading } = useAsyncData(() => fetchTherapies(), []);
  const { data: videos, loading: videosLoading } = useAsyncData(() => fetchYoutubeVideos(), []);
  const { data: sliders } = useAsyncData(() => fetchSliders(), []);

  const promoVideos = filterVideosByCategory(videos, "promo");
  const referenceVideos = filterVideosByCategory(videos, "reference");
  const featuredTherapies = (therapies ?? []).filter((x) => x.featured).slice(0, 3);

  const heroSlides =
    (sliders ?? []).length > 0
      ? (sliders ?? []).map((s) => ({
          id: s.id,
          image: s.image_url,
        }))
      : fallbackHeroSlides;

  const headline = (localized(site.heroHeadline, lang) || t("home.headline")).trim();
  const sub = (localized(site.heroSub, lang) || t("home.sub")).trim();
  const ctaAppoint = (localized(site.heroCtaPrimary, lang) || t("home.ctaAppoint")).trim();
  const ctaAssess = (localized(site.heroCtaSecondary, lang) || t("home.ctaAssess")).trim();

  const showcaseSlides = [
    { id: "s1", image: media.diagnostic.one, title: t("nav.diagnostics") },
    { id: "s2", image: media.diagnostic.two, title: t("home.featuredMedical") },
    { id: "s3", image: media.diagnostic.three, title: t("medical.diagnosticsTitle") },
    { id: "s4", image: media.diagnostic.four, title: t("medical.title") },
    { id: "s5", image: media.school.one, title: t("home.autismHub") },
    { id: "s6", image: media.school.two, title: t("nav.activities") },
  ];

  const marqueeText = (localized(site.marquee, lang) || site.marquee.en || site.marquee.bn).trim();

  return (
    <>
      <Seo
        title={t("seo.homeTitle")}
        description={t("seo.homeDesc")}
        lang={lang}
        path=""
        jsonLd={orgJsonLd(lang, site)}
      />

      <section className={`home-hero-wrap${marqueeText ? " home-hero-wrap--marquee" : ""}`}>
        <Carousel
          variant="hero"
          slides={heroSlides}
          interval={5000}
          overlay={
            <div className="container home-hero-layout">
              <div className="home-hero-inner home-hero-copy">
                <p className="home-brand">{site.brand || t("brand.name")}</p>
                <h1>{headline}</h1>
                <p className="home-sub">{sub}</p>
                <ul className="hero-depts" aria-label={t("home.heroDeptsLabel")}>
                  <li>
                    <span className="hero-dept-code">PT</span>
                    <span>{t("home.deptPt")}</span>
                  </li>
                  <li>
                    <span className="hero-dept-code">AT</span>
                    <span>{t("home.deptOt")}</span>
                  </li>
                  <li>
                    <span className="hero-dept-code">SLT</span>
                    <span>{t("home.deptSlt")}</span>
                  </li>
                  <li>
                    <span className="hero-dept-code">NT</span>
                    <span>{t("home.deptNt")}</span>
                  </li>
                </ul>
                <div className="btn-row">
                  <Link className="btn btn-primary" to={link("/appointment")}>
                    {ctaAppoint}
                  </Link>
                  <Link className="btn btn-ghost" to={link("/assessment")}>
                    {ctaAssess}
                  </Link>
                </div>
              </div>
            </div>
          }
        />
        {marqueeText ? (
          <div className="hero-marquee" aria-label={marqueeText}>
            <div className="hero-marquee-track">
              <span>{marqueeText}</span>
              <span aria-hidden>{marqueeText}</span>
              <span aria-hidden>{marqueeText}</span>
              <span aria-hidden>{marqueeText}</span>
            </div>
          </div>
        ) : null}
      </section>

      {(videosLoading || promoVideos.length > 0) && (
        <Reveal>
          <section className="section">
            <div className="container">
              <div className="section-head">
                <h2>{t("videos.title")}</h2>
                <p>{t("videos.sub")}</p>
              </div>
              {videosLoading ? (
                <p className="empty-note">{t("common.loading")}</p>
              ) : (
                <VideoGrid videos={promoVideos} lang={lang} fallbackTitle={t("videos.title")} />
              )}
            </div>
          </section>
        </Reveal>
      )}

      {(videosLoading || referenceVideos.length > 0) && (
        <Reveal>
          <section className="section">
            <div className="container">
              <div className="section-head">
                <h2>{t("videos.referenceTitle")}</h2>
                <p>{t("videos.referenceSub")}</p>
              </div>
              {videosLoading ? (
                <p className="empty-note">{t("common.loading")}</p>
              ) : (
                <VideoGrid videos={referenceVideos} lang={lang} fallbackTitle={t("videos.referenceTitle")} />
              )}
            </div>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>{(localized(site.hubsTitle, lang) || t("home.hubsTitle")).trim()}</h2>
              <p>{(localized(site.hubsSub, lang) || t("home.hubsSub")).trim()}</p>
            </div>
            <div className="hub-strip stagger">
              <Reveal className="reveal-scale" delay={0}>
                <Link to={link(site.hubMedicalLink || "/medical")} className="hub-panel medical">
                  <div className="hub-panel-media">
                    <img src={site.hubMedicalImage || media.diagnostic.four} alt="" loading="lazy" />
                  </div>
                  <div className="hub-panel-body">
                    <h3>{(localized(site.hubMedicalTitle, lang) || t("home.medicalHub")).trim()}</h3>
                    <p>{(localized(site.hubMedicalText, lang) || t("home.medicalHubText")).trim()}</p>
                    <span>{t("common.readMore")} →</span>
                  </div>
                </Link>
              </Reveal>
              <Reveal className="reveal-scale" delay={120}>
                <Link to={link(site.hubAutismLink || "/autism")} className="hub-panel autism">
                  <div className="hub-panel-media">
                    <img src={site.hubAutismImage || media.school.one} alt="" loading="lazy" />
                  </div>
                  <div className="hub-panel-body">
                    <h3>{(localized(site.hubAutismTitle, lang) || t("home.autismHub")).trim()}</h3>
                    <p>{(localized(site.hubAutismText, lang) || t("home.autismHubText")).trim()}</p>
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
