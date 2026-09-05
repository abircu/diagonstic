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
  heroHeadline: Localized;
  heroSub: Localized;
  heroCtaPrimary: Localized;
  heroCtaSecondary: Localized;
  hubsTitle: Localized;
  hubsSub: Localized;
  hubMedicalTitle: Localized;
  hubMedicalText: Localized;
  hubMedicalImage: string | null;
  hubMedicalLink: string;
  hubAutismTitle: Localized;
  hubAutismText: Localized;
  hubAutismImage: string | null;
  hubAutismLink: string;
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
    heroHeadline: asLocalized(row.hero_headline),
    heroSub: asLocalized(row.hero_sub),
    heroCtaPrimary: asLocalized(row.hero_cta_primary),
    heroCtaSecondary: asLocalized(row.hero_cta_secondary),
    hubsTitle: asLocalized(row.hubs_title),
    hubsSub: asLocalized(row.hubs_sub),
    hubMedicalTitle: asLocalized(row.hub_medical_title),
    hubMedicalText: asLocalized(row.hub_medical_text),
    hubMedicalImage: row.hub_medical_image?.trim() || null,
    hubMedicalLink: row.hub_medical_link?.trim() || "/medical",
    hubAutismTitle: asLocalized(row.hub_autism_title),
    hubAutismText: asLocalized(row.hub_autism_text),
    hubAutismImage: row.hub_autism_image?.trim() || null,
    hubAutismLink: row.hub_autism_link?.trim() || "/autism",
    url: siteConfig.url,
  };
}

const emptyLoc = (): Localized => ({ en: "", bn: "" });

const fallback: SiteContact = {
  brand: siteConfig.brand,
  brandShort: siteConfig.brandShort,
  tagline: { ...siteConfig.tagline },
  phones: { ...siteConfig.phones },
  email: { ...siteConfig.email },
  address: { ...siteConfig.address },
  hours: { ...siteConfig.hours },
  social: { ...siteConfig.social },
  marquee: emptyLoc(),
  logoUrl: null,
  heroHeadline: emptyLoc(),
  heroSub: emptyLoc(),
  heroCtaPrimary: emptyLoc(),
  heroCtaSecondary: emptyLoc(),
  hubsTitle: emptyLoc(),
  hubsSub: emptyLoc(),
  hubMedicalTitle: emptyLoc(),
  hubMedicalText: emptyLoc(),
  hubMedicalImage: null,
  hubMedicalLink: "/medical",
  hubAutismTitle: emptyLoc(),
  hubAutismText: emptyLoc(),
  hubAutismImage: null,
  hubAutismLink: "/autism",
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
