import type { Localized } from "./departments";

export type Specialty = {
  slug: string;
  name: Localized;
  summary: Localized;
};

export const specialties: Specialty[] = [
  {
    slug: "dental-unit",
    name: { en: "Dental Unit", bn: "ডেন্টাল ইউনিট" },
    summary: {
      en: "Comprehensive oral healthcare with modern techniques.",
      bn: "আধুনিক কৌশলে সমন্বিত মুখ ও দাঁতের সেবা।",
    },
  },
  {
    slug: "cancer-center",
    name: { en: "Cancer Center", bn: "ক্যানসার সেন্টার" },
    summary: {
      en: "Compassionate oncology care with coordinated specialists.",
      bn: "সমন্বিত বিশেষজ্ঞসহ সহানুভূতিশীল অনকোলজি সেবা।",
    },
  },
  {
    slug: "cardiac-surgery",
    name: { en: "Cardiac Surgery", bn: "কার্ডিয়াক সার্জারি" },
    summary: {
      en: "Expert heart surgery backed by advanced critical care.",
      bn: "উন্নত ক্রিটিক্যাল কেয়ারসহ বিশেষজ্ঞ হৃদয় অস্ত্রোপচার।",
    },
  },
  {
    slug: "neurosurgery-center",
    name: { en: "Neurosurgery", bn: "নিউরোসার্জারি" },
    summary: {
      en: "Cutting-edge brain and spine surgical care.",
      bn: "অত্যাধুনিক মস্তিষ্ক ও মেরুদণ্ড অস্ত্রোপচার সেবা।",
    },
  },
  {
    slug: "limb-center",
    name: { en: "Limb Center", bn: "লিম্ব সেন্টার" },
    summary: {
      en: "Affordable artificial limbs, braces, and pressure garments.",
      bn: "সাশ্রয়ী কৃত্রিম অঙ্গ, ব্রেস ও প্রেশার গার্মেন্টস।",
    },
  },
  {
    slug: "transfusion-medicine",
    name: { en: "Transfusion Medicine", bn: "ট্রান্সফিউশন মেডিসিন" },
    summary: {
      en: "Safe blood products for treatment, surgery, and emergencies.",
      bn: "চিকিৎসা, অস্ত্রোপচার ও জরুরি অবস্থার জন্য নিরাপদ রক্ত পণ্য।",
    },
  },
];

export type Diagnostic = {
  slug: string;
  name: Localized;
  summary: Localized;
};

export const diagnostics: Diagnostic[] = [
  {
    slug: "mri",
    name: { en: "MRI", bn: "এমআরআই" },
    summary: {
      en: "Detailed imaging for accurate diagnosis and treatment planning.",
      bn: "সঠিক নির্ণয় ও চিকিৎসা পরিকল্পনার জন্য বিস্তারিত ইমেজিং।",
    },
  },
  {
    slug: "ct",
    name: { en: "CT Scan", bn: "সিটি স্ক্যান" },
    summary: {
      en: "Fast, precise diagnostic imaging with compassionate care.",
      bn: "সহানুভূতিশীল সেবায় দ্রুত, নির্ভুল ডায়াগনস্টিক ইমেজিং।",
    },
  },
  {
    slug: "xray",
    name: { en: "X-Ray", bn: "এক্স-রে" },
    summary: {
      en: "Clear radiographic imaging by experienced radiologists.",
      bn: "অভিজ্ঞ রেডিওলজিস্টদের দ্বারা স্পষ্ট রেডিওগ্রাফিক ইমেজিং।",
    },
  },
  {
    slug: "ultrasound",
    name: { en: "Ultrasound", bn: "আল্ট্রাসাউন্ড" },
    summary: {
      en: "Real-time imaging for confident clinical decisions.",
      bn: "আত্মবিশ্বাসী ক্লিনিকাল সিদ্ধান্তের জন্য রিয়েল-টাইম ইমেজিং।",
    },
  },
  {
    slug: "mammography",
    name: { en: "Mammography", bn: "ম্যামোগ্রাফি" },
    summary: {
      en: "Breast screening that supports early detection.",
      bn: "প্রাথমিক সনাক্তকরণে সহায়ক স্তন স্ক্রিনিং।",
    },
  },
];

export type HealthPackage = {
  slug: string;
  name: Localized;
  summary: Localized;
  includes: Localized[];
};

export const packages: HealthPackage[] = [
  {
    slug: "executive-basic",
    name: { en: "Executive Basic", bn: "এক্সিকিউটিভ বেসিক" },
    summary: {
      en: "Core screening for early detection of common health risks.",
      bn: "সাধারণ স্বাস্থ্য ঝুঁকির প্রাথমিক সনাক্তকরণের মূল স্ক্রিনিং।",
    },
    includes: [
      { en: "Physician consult", bn: "চিকিৎসক পরামর্শ" },
      { en: "Blood & urine panel", bn: "রক্ত ও প্রস্রাব প্যানেল" },
      { en: "Chest X-ray", bn: "বুকের এক্স-রে" },
      { en: "ECG", bn: "ইসিজি" },
    ],
  },
  {
    slug: "executive-plus",
    name: { en: "Executive Plus", bn: "এক্সিকিউটিভ প্লাস" },
    summary: {
      en: "Expanded diagnostics for adults seeking thorough annual checks.",
      bn: "সম্পূর্ণ বার্ষিক চেকআপ চাওয়া প্রাপ্তবয়স্কদের জন্য সম্প্রসারিত ডায়াগনস্টিক্স।",
    },
    includes: [
      { en: "Everything in Basic", bn: "বেসিকের সবকিছু" },
      { en: "Ultrasound abdomen", bn: "অ্যাবডোমেন আল্ট্রাসাউন্ড" },
      { en: "Lipid & diabetes panel", bn: "লিপিড ও ডায়াবেটিস প্যানেল" },
      { en: "Diet counseling", bn: "ডায়েট কাউন্সেলিং" },
    ],
  },
  {
    slug: "women-wellness",
    name: { en: "Women’s Wellness", bn: "নারী ওয়েলনেস" },
    summary: {
      en: "Focused screenings for women’s health across life stages.",
      bn: "জীবনের বিভিন্ন পর্যায়ে নারী স্বাস্থ্যের জন্য কেন্দ্রিত স্ক্রিনিং।",
    },
    includes: [
      { en: "OB-GYN consult", bn: "ওবি-জাইনি পরামর্শ" },
      { en: "Mammography / USG as advised", bn: "ম্যামোগ্রাফি / ইউএসজি পরামর্শমতো" },
      { en: "Lab panel", bn: "ল্যাব প্যানেল" },
      { en: "Bone health review", bn: "হাড়ের স্বাস্থ্য পর্যালোচনা" },
    ],
  },
];

export type PatientService = {
  slug: string;
  name: Localized;
  summary: Localized;
  linkPath?: string;
};

export const patientServices: PatientService[] = [
  {
    slug: "ambulance",
    name: { en: "Ambulance", bn: "অ্যাম্বুলেন্স" },
    summary: { en: "Rapid ambulance booking and emergency transport.", bn: "দ্রুত অ্যাম্বুলেন্স বুকিং ও জরুরি পরিবহন।" },
    linkPath: "/ambulance",
  },
  {
    slug: "pharmacy",
    name: { en: "Pharmacy", bn: "ফার্মেসি" },
    summary: { en: "On-campus medicines for inpatients and OPD visitors.", bn: "ইনপেশেন্ট ও ওপিডি দর্শনার্থীদের জন্য ক্যাম্পাস ওষুধ।" },
  },
  {
    slug: "blood-bank",
    name: { en: "Blood Bank", bn: "ব্লাড ব্যাংক" },
    summary: { en: "Safe blood supply for surgery and emergencies.", bn: "অস্ত্রোপচার ও জরুরি অবস্থার জন্য নিরাপদ রক্ত সরবরাহ।" },
  },
  {
    slug: "guest-house",
    name: { en: "Guest House", bn: "গেস্ট হাউস" },
    summary: { en: "Affordable stay options for patient families.", bn: "রোগীর পরিবারের জন্য সাশ্রয়ী থাকার ব্যবস্থা।" },
  },
];
