import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchYoutubeVideos } from "../services/content";
import { localized, useLang } from "../hooks/useLang";
import { youtubeEmbedUrl } from "../lib/youtube";
import "./Videos.css";

export function VideosPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { data, loading, error } = useAsyncData(() => fetchYoutubeVideos(), []);
  const videos = data ?? [];

  return (
    <>
      <Seo title={`${t("videos.title")} | ${t("brand.short")}`} description={t("videos.sub")} lang={lang} path="/videos" />
      <PageHero title={t("videos.title")} subtitle={t("videos.sub")} crumbs={[{ label: t("nav.videos") }]} />
      <section className="section">
        <div className="container">
          {loading ? <p className="empty-note">{t("common.loading")}</p> : null}
          {error ? <p className="error">{error}</p> : null}
          {!loading && !error && videos.length === 0 ? (
            <p className="empty-note">{t("videos.empty")}</p>
          ) : null}
          <div className="videos-grid">
            {videos.map((v) => {
              const embed = youtubeEmbedUrl(v.youtube_url);
              const title = localized(asLocalized(v.title), lang);
              if (!embed) return null;
              return (
                <article key={v.id} className="video-card">
                  <div className="video-frame">
                    <iframe
                      src={embed}
                      title={title || t("videos.title")}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                  {title ? <h2 className="video-title">{title}</h2> : null}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
