import { useEffect, useState } from "react";
import { siteConfig } from "../config/site";
import type { Localized } from "../lib/database.types";
import { asLocalized, fetchSiteSettings, type SiteSettingsRow } from "../services/content";

export type SiteContact = {
  brand: string;
  brandShort: string;
  tagline: Localized;
  phones: {
    main: string;
    mainDisplay: string;
    medical: string;
    medicalDisplay: string;
    admission: string;
    admissionDisplay: string;
  };
  email: { info: string; admission: string };
  address: Localized;
  hours: Localized;
  social: { facebook?: string; youtube?: string };
  marquee: Localized;
  logoUrl: string | null;
  url: string;
};

function fromRow(row: SiteSettingsRow): SiteContact {
  const social = (row.social ?? {}) as { facebook?: string; youtube?: string; marquee?: unknown; logo?: string };
  return {
    brand: row.brand || siteConfig.brand,
    brandShort: row.brand_short || siteConfig.brandShort,
    tagline: asLocalized(row.tagline),
    phones: {
      main: row.phone_main || siteConfig.phones.main,
      mainDisplay: row.phone_main_display || siteConfig.phones.mainDisplay,
      medical: row.phone_medical || siteConfig.phones.medical,
      medicalDisplay: row.phone_medical_display || siteConfig.phones.medicalDisplay,
      admission: row.phone_admission || siteConfig.phones.admission,
      admissionDisplay: row.phone_admission_display || siteConfig.phones.admissionDisplay,
    },
    email: {
      info: row.email_info || siteConfig.email.info,
      admission: row.email_admission || siteConfig.email.admission,
    },
    address: asLocalized(row.address),
    hours: asLocalized(row.hours),
    social: {
      facebook: social.facebook || siteConfig.social.facebook,
      youtube: social.youtube || siteConfig.social.youtube,
    },
    marquee: (() => {
      const fromCol = asLocalized(row.marquee_text);
      const fromSocial = asLocalized(social.marquee);
      if (fromCol.en.trim() || fromCol.bn.trim()) return fromCol;
      return fromSocial;
    })(),
    logoUrl: row.logo_url?.trim() || (typeof social.logo === "string" ? social.logo : null) || null,
    url: siteConfig.url,
  };
}

const fallback: SiteContact = {
  brand: siteConfig.brand,
  brandShort: siteConfig.brandShort,
  tagline: { ...siteConfig.tagline },
  phones: { ...siteConfig.phones },
  email: { ...siteConfig.email },
  address: { ...siteConfig.address },
  hours: { ...siteConfig.hours },
  social: { ...siteConfig.social },
  marquee: { en: "", bn: "" },
  logoUrl: null,
  url: siteConfig.url,
};

export function useSiteSettings() {
  const [site, setSite] = useState<SiteContact>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings()
      .then((row) => {
        if (!cancelled && row) setSite(fromRow(row));
      })
      .catch(() => {
        /* keep fallback */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { site, loading };
}
