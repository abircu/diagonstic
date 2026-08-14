import type { Localized } from "./departments";

export type Program = {
  slug: string;
  name: Localized;
  age: Localized;
  summary: Localized;
  offer: Localized;
  why: Localized;
  benefits: Localized[];
  featured?: boolean;
};

export const programs: Program[] = [
  {
    slug: "early-intervention",
    name: { en: "Early Intervention Program", bn: "আর্লি ইন্টারভেনশন প্রোগ্রাম" },
    age: { en: "Ages 2–5", bn: "বয়স ২–৫" },
    summary: {
      en: "Developing speech, motor, and social skills through guided play.",
      bn: "নির্দেশিত খেলার মাধ্যমে কথা, মোটর ও সামাজিক দক্ষতা গড়া।",
    },
    offer: {
      en: "Play-based learning, therapy integration, and caregiver coaching for school-ready foundations.",
      bn: "খেলার মাধ্যমে শেখা, থেরাপি সমন্বয় ও স্কুল-প্রস্তুত ভিত্তির জন্য অভিভাবক কোচিং।",
    },
    why: {
      en: "Early support helps children build skills faster during critical developmental windows.",
      bn: "গুরুত্বপূর্ণ বিকাশকালে আগাম সহায়তা শিশুদের দ্রুত দক্ষতা গড়তে সাহায্য করে।",
    },
    benefits: [
      { en: "Speech & motor growth", bn: "কথা ও মোটর বৃদ্ধি" },
      { en: "Social confidence", bn: "সামাজিক আত্মবিশ্বাস" },
      { en: "Family routines", bn: "পরিবার রুটিন" },
    ],
    featured: true,
  },
  {
    slug: "pre-schooling",
    name: { en: "Pre-Schooling Program", bn: "প্রি-স্কুলিং প্রোগ্রাম" },
    age: { en: "School-ready skills", bn: "স্কুল-প্রস্তুত দক্ষতা" },
    summary: {
      en: "Structured classroom routines that prepare children for learning groups.",
      bn: "শেখার গ্রুপের জন্য শিশুদের প্রস্তুত করা কাঠামোবদ্ধ শ্রেণিকক্ষ রুটিন।",
    },
    offer: {
      en: "Circle time, fine motor work, language groups, and therapy pull-outs as needed.",
      bn: "সার্কেল টাইম, সূক্ষ্ম মোটর কাজ, ভাষা গ্রুপ এবং প্রয়োজনে থেরাপি পুল-আউট।",
    },
    why: {
      en: "Predictable structure helps children transition into more formal learning.",
      bn: "পূর্বানুমানযোগ্য কাঠামো শিশুদের আরও আনুষ্ঠানিক শিক্ষায় স্থানান্তরে সাহায্য করে।",
    },
    benefits: [
      { en: "Classroom readiness", bn: "শ্রেণিকক্ষ প্রস্তুতি" },
      { en: "Peer interaction", bn: "সহপাঠী মিথস্ক্রিয়া" },
      { en: "Attention skills", bn: "মনোযোগ দক্ষতা" },
    ],
    featured: true,
  },
  {
    slug: "special-education",
    name: { en: "Special Education Program", bn: "বিশেষ শিক্ষা প্রোগ্রাম" },
    age: { en: "Personalized IEPs", bn: "ব্যক্তিগত আইইপি" },
    summary: {
      en: "Individualized Education Plans based on each child’s unique needs.",
      bn: "প্রতিটি শিশুর অনন্য চাহিদার উপর ভিত্তি করে ব্যক্তিগত শিক্ষা পরিকল্পনা।",
    },
    offer: {
      en: "Adaptive curriculum, small groups, therapy coordination, and monthly parent meetings.",
      bn: "অভিযোজিত পাঠ্যক্রম, ছোট গ্রুপ, থেরাপি সমন্বয় ও মাসিক অভিভাবক সভা।",
    },
    why: {
      en: "Learning works best when academics and therapy share one consistent plan.",
      bn: "একাডেমিক ও থেরাপি এক ধারাবাহিক পরিকল্পনায় থাকলে শেখা সবচেয়ে ভালো হয়।",
    },
    benefits: [
      { en: "IEP clarity", bn: "আইইপি স্বচ্ছতা" },
      { en: "Measurable progress", bn: "পরিমাপযোগ্য অগ্রগতি" },
      { en: "Mainstream pathway guidance", bn: "মেইনস্ট্রিম পথ নির্দেশনা" },
    ],
    featured: true,
  },
  {
    slug: "vocational-life-skills",
    name: { en: "Vocational & Life Skills", bn: "ভোকেশনাল ও লাইফ স্কিলস" },
    age: { en: "Ages 14+", bn: "বয়স ১৪+" },
    summary: {
      en: "Practical job preparation to build long-term independence.",
      bn: "দীর্ঘমেয়াদি স্বাধীনতা গড়তে বাস্তব কর্ম প্রস্তুতি।",
    },
    offer: {
      en: "Life skills labs, workplace routines, social practice, and caregiver planning.",
      bn: "লাইফ স্কিলস ল্যাব, কর্মক্ষেত্র রুটিন, সামাজিক অনুশীলন ও অভিভাবক পরিকল্পনা।",
    },
    why: {
      en: "Independence grows when daily living and work skills are taught together.",
      bn: "দৈনন্দিন জীবন ও কাজের দক্ষতা একসাথে শেখালে স্বাধীনতা বাড়ে।",
    },
    benefits: [
      { en: "Daily living skills", bn: "দৈনন্দিন জীবন দক্ষতা" },
      { en: "Work readiness", bn: "কর্ম প্রস্তুতি" },
      { en: "Community confidence", bn: "কমিউনিটি আত্মবিশ্বাস" },
    ],
    featured: true,
  },
  {
    slug: "structured-academic-support",
    name: { en: "Structured Academic Support", bn: "কাঠামোবদ্ধ একাডেমিক সহায়তা" },
    age: { en: "All school ages", bn: "সব স্কুল বয়স" },
    summary: {
      en: "Focused academic coaching aligned with each child’s IEP goals.",
      bn: "প্রতিটি শিশুর আইইপি লক্ষ্যের সাথে সামঞ্জস্যপূর্ণ একাডেমিক কোচিং।",
    },
    offer: {
      en: "Literacy, numeracy, and study routines with therapy-informed pacing.",
      bn: "থেরাপি-সচেতন গতিতে সাক্ষরতা, গণিত ও অধ্যয়ন রুটিন।",
    },
    why: {
      en: "Academic growth sticks when instruction matches attention and communication needs.",
      bn: "মনোযোগ ও যোগাযোগ চাহিদার সাথে নির্দেশনা মিললে একাডেমিক বৃদ্ধি স্থায়ী হয়।",
    },
    benefits: [
      { en: "Literacy gains", bn: "সাক্ষরতা অগ্রগতি" },
      { en: "Math confidence", bn: "গণিত আত্মবিশ্বাস" },
      { en: "Study habits", bn: "অধ্যয়ন অভ্যাস" },
    ],
  },
];

export function getProgram(slug: string) {
  return programs.find((p) => p.slug === slug);
}
