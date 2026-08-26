/** Extract YouTube video id from common URL formats. */
export function parseYoutubeId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const v = url.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      const parts = url.pathname.split("/").filter(Boolean);
      const embedIdx = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "live" || p === "v");
      if (embedIdx >= 0 && parts[embedIdx + 1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[embedIdx + 1])) {
        return parts[embedIdx + 1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function youtubeEmbedUrl(input: string): string | null {
  const id = parseYoutubeId(input);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

export function youtubeThumbUrl(input: string): string | null {
  const id = parseYoutubeId(input);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export type VideoEmbed =
  | { kind: "iframe"; src: string }
  | { kind: "video"; src: string };

/** YouTube embed iframe, or Cloudinary / direct video file. */
export function resolveVideoEmbed(input: string): VideoEmbed | null {
  const raw = input.trim();
  if (!raw) return null;

  const yt = youtubeEmbedUrl(raw);
  if (yt) return { kind: "iframe", src: yt };

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.toLowerCase();
    const isCloudinary = host.includes("cloudinary.com") || host.includes("res.cloudinary.com");
    const isFile = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(path) || /\.(mp4|webm|ogg|mov)(\?|$)/i.test(raw);
    if (isCloudinary || isFile) return { kind: "video", src: raw };
  } catch {
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(raw)) return { kind: "video", src: raw };
  }

  return null;
}

export function isValidPromoVideoUrl(input: string): boolean {
  return Boolean(resolveVideoEmbed(input));
}
