import { resolveVideoEmbed } from "../lib/youtube";
import { asLocalized } from "../services/content";
import type { YoutubeVideoRow } from "../services/content";
import type { Lang } from "../config/site";
import { localized } from "../hooks/useLang";
import "../pages/Videos.css";

type Props = {
  videos: YoutubeVideoRow[];
  lang: Lang;
  fallbackTitle: string;
};

export function VideoGrid({ videos, lang, fallbackTitle }: Props) {
  return (
    <div className="videos-grid">
      {videos.map((v) => {
        const embed = resolveVideoEmbed(v.youtube_url);
        const title = localized(asLocalized(v.title), lang);
        if (!embed) return null;
        return (
          <article key={v.id} className="video-card">
            <div className="video-frame">
              {embed.kind === "iframe" ? (
                <iframe
                  src={embed.src}
                  title={title || fallbackTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <video src={embed.src} controls playsInline preload="metadata" title={title || fallbackTitle} />
              )}
            </div>
            {title ? <h2 className="video-title">{title}</h2> : null}
          </article>
        );
      })}
    </div>
  );
}

export type VideoCategory = "promo" | "reference";

export function filterVideosByCategory(videos: YoutubeVideoRow[] | null | undefined, category: VideoCategory) {
  return (videos ?? []).filter((v) => {
    const c = (v as YoutubeVideoRow & { category?: string }).category ?? "promo";
    return c === category;
  });
}
