import { siteConfig, type Lang } from "../config/site";
import type { SiteContact } from "../hooks/useSiteSettings";
import { localized } from "../hooks/useLang";

export function orgJsonLd(lang: Lang, site?: SiteContact) {
  const s = site ?? {
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
    heroHeadline: { en: "", bn: "" },
    heroSub: { en: "", bn: "" },
    heroCtaPrimary: { en: "", bn: "" },
    heroCtaSecondary: { en: "", bn: "" },
    hubsTitle: { en: "", bn: "" },
    hubsSub: { en: "", bn: "" },
    hubMedicalTitle: { en: "", bn: "" },
    hubMedicalText: { en: "", bn: "" },
    hubMedicalImage: null,
    hubMedicalLink: "/medical",
    hubAutismTitle: { en: "", bn: "" },
    hubAutismText: { en: "", bn: "" },
    hubAutismImage: null,
    hubAutismLink: "/autism",
    url: siteConfig.url,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalOrganization",
        name: s.brand,
        url: `${s.url}/${lang}`,
        telephone: s.phones.medicalDisplay,
        email: s.email.info,
        address: localized(s.address, lang),
        medicalSpecialty: ["Cardiology", "Pediatrics", "Neurology", "Emergency"],
      },
      {
        "@type": "EducationalOrganization",
        name: `${s.brand} — Autism School`,
        url: `${s.url}/${lang}/autism`,
        telephone: s.phones.admissionDisplay,
        description:
          lang === "bn"
            ? "অটিজম স্কুল ও ইন্টিগ্রেটেড থেরাপি সেন্টার"
            : "Autism school and integrated therapy center",
      },
    ],
  };
}
