export const siteConfig = {
  brand: "Daig Medical & Autism Care",
  brandShort: "Daig",
  tagline: {
    en: "Hospital care and autism support under one roof",
    bn: "এক ছাদের নিচে হাসপাতাল সেবা ও অটিজম সহায়তা",
  },
  url: "https://daig.example.com",
  phones: {
    main: "+8801615335292",
    mainDisplay: "+880 1615 335 292",
    medical: "+8809677602660",
    medicalDisplay: "+880 9677 602 660",
    admission: "+8801726065473",
    admissionDisplay: "+880 1726 065 473",
  },
  email: {
    info: "info@daig.example.com",
    admission: "admission@daig.example.com",
  },
  address: {
    en: "Enayetpur Road Campus, Sirajganj & South Banasree Outreach, Dhaka",
    bn: "এনায়েতপুর রোড ক্যাম্পাস, সিরাজগঞ্জ ও সাউথ বনশ্রী আউটরিচ, ঢাকা",
  },
  hours: {
    en: "OPD 8:30 AM – 5:30 PM · IPD 24×7 · Therapy shifts available",
    bn: "ওপিডি ৮:৩০ পূর্বাহ্ন – ৫:৩০ অপরাহ্ন · আইপিডি ২৪×৭ · থেরাপি শিফট উপলব্ধ",
  },
  social: {
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
  },
} as const;

export type Lang = "en" | "bn";

export const langs: Lang[] = ["en", "bn"];
