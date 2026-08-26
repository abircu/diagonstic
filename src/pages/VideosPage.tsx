import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { VideoGrid, filterVideosByCategory } from "../components/VideoGrid";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { fetchYoutubeVideos } from "../services/content";
import { useLang } from "../hooks/useLang";
import "./Videos.css";

export function VideosPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { data, loading, error } = useAsyncData(() => fetchYoutubeVideos(), []);
  const promoVideos = filterVideosByCategory(data, "promo");
  const referenceVideos = filterVideosByCategory(data, "reference");
  const empty = !loading && !error && promoVideos.length === 0 && referenceVideos.length === 0;

  return (
    <>
      <Seo title={`${t("nav.videos")} | ${t("brand.short")}`} description={t("videos.sub")} lang={lang} path="/videos" />
      <PageHero title={t("nav.videos")} subtitle={t("videos.pageSub")} crumbs={[{ label: t("nav.videos") }]} />

      {loading ? (
        <section className="section">
          <div className="container">
            <p className="empty-note">{t("common.loading")}</p>
          </div>
        </section>
      ) : null}
      {error ? (
        <section className="section">
          <div className="container">
            <p className="error">{error}</p>
          </div>
        </section>
      ) : null}
      {empty ? (
        <section className="section">
          <div className="container">
            <p className="empty-note">{t("videos.empty")}</p>
          </div>
        </section>
      ) : null}

      {promoVideos.length > 0 ? (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>{t("videos.title")}</h2>
              <p>{t("videos.sub")}</p>
            </div>
            <VideoGrid videos={promoVideos} lang={lang} fallbackTitle={t("videos.title")} />
          </div>
        </section>
      ) : null}

      {referenceVideos.length > 0 ? (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>{t("videos.referenceTitle")}</h2>
              <p>{t("videos.referenceSub")}</p>
            </div>
            <VideoGrid videos={referenceVideos} lang={lang} fallbackTitle={t("videos.referenceTitle")} />
          </div>
        </section>
      ) : null}
    </>
  );
}
