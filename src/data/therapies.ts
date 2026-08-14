import type { Localized } from "./departments";

export type Therapy = {
  slug: string;
  name: Localized;
  summary: Localized;
  what: Localized;
  how: Localized;
  benefits: Localized[];
  featured?: boolean;
};

export const therapies: Therapy[] = [
  {
    slug: "aba-therapy",
    name: { en: "Applied Behavior Analysis (ABA)", bn: "অ্যাপ্লাইড বিহেভিয়ার অ্যানালিসিস (এবিএ)" },
    summary: {
      en: "One-on-one sessions that build communication, social behavior, and daily living skills.",
      bn: "যোগাযোগ, সামাজিক আচরণ ও দৈনন্দিন দক্ষতা গড়ার এক-এক সেশন।",
    },
    what: {
      en: "ABA uses structured, data-led teaching to strengthen helpful skills and reduce barriers to learning.",
      bn: "এবিএ কাঠামোবদ্ধ, ডেটা-ভিত্তিক শিক্ষার মাধ্যমে সহায়ক দক্ষতা বাড়ায় ও শেখার বাধা কমায়।",
    },
    how: {
      en: "Assessment, goal setting, daily sessions, progress review, and parent partnership.",
      bn: "মূল্যায়ন, লক্ষ্য নির্ধারণ, দৈনিক সেশন, অগ্রগতি পর্যালোচনা ও অভিভাবক অংশীদারিত্ব।",
    },
    benefits: [
      { en: "Clear, measurable goals", bn: "স্পষ্ট, পরিমাপযোগ্য লক্ষ্য" },
      { en: "Consistent daily structure", bn: "ধারাবাহিক দৈনিক কাঠামো" },
      { en: "Family coaching included", bn: "পরিবার কোচিং অন্তর্ভুক্ত" },
    ],
    featured: true,
  },
  {
    slug: "speech-language-therapy",
    name: { en: "Speech & Language Therapy", bn: "স্পিচ ও ল্যাঙ্গুয়েজ থেরাপি" },
    summary: {
      en: "Helping children communicate through words, gestures, or assistive tools.",
      bn: "কথা, ইঙ্গিত বা সহায়ক সরঞ্জামের মাধ্যমে শিশুদের যোগাযোগে সাহায্য।",
    },
    what: {
      en: "Speech therapy builds expressive and receptive language with practical session activities.",
      bn: "স্পিচ থেরাপি বাস্তব সেশন কার্যক্রমের মাধ্যমে প্রকাশক ও গ্রহণযোগ্য ভাষা গড়ে তোলে।",
    },
    how: {
      en: "Play-based drills, AAC options when needed, and home practice plans.",
      bn: "খেলার মাধ্যমে অনুশীলন, প্রয়োজনে এএসি এবং বাড়ির অনুশীলন পরিকল্পনা।",
    },
    benefits: [
      { en: "Stronger communication", bn: "শক্তিশালী যোগাযোগ" },
      { en: "Social readiness", bn: "সামাজিক প্রস্তুতি" },
      { en: "Parent strategies", bn: "অভিভাবক কৌশল" },
    ],
    featured: true,
  },
  {
    slug: "occupational-therapy",
    name: { en: "Occupational Therapy", bn: "অকুপেশনাল থেরাপি" },
    summary: {
      en: "Fine motor skills, sensory regulation, and self-care through guided play.",
      bn: "নির্দেশিত খেলার মাধ্যমে সূক্ষ্ম মোটর দক্ষতা, সেন্সরি নিয়ন্ত্রণ ও স্ব-যত্ন।",
    },
    what: {
      en: "OT supports independence in dressing, writing, feeding, and sensory comfort.",
      bn: "ওটি পোশাক পরা, লেখা, খাওয়া ও সেন্সরি আরামে স্বাধীনতা সমর্থন করে।",
    },
    how: {
      en: "Sensory profiles, motor goals, and classroom/home carryover.",
      bn: "সেন্সরি প্রোফাইল, মোটর লক্ষ্য এবং শ্রেণিকক্ষ/বাড়িতে প্রয়োগ।",
    },
    benefits: [
      { en: "Better self-care", bn: "উন্নত স্ব-যত্ন" },
      { en: "Sensory calm", bn: "সেন্সরি শান্তি" },
      { en: "School readiness", bn: "স্কুল প্রস্তুতি" },
    ],
    featured: true,
  },
  {
    slug: "physiotherapy",
    name: { en: "Physiotherapy", bn: "ফিজিওথেরাপি" },
    summary: {
      en: "Strength, balance, and coordination through structured physical activities.",
      bn: "কাঠামোবদ্ধ শারীরিক কার্যক্রমে শক্তি, ভারসাম্য ও সমন্বয়।",
    },
    what: {
      en: "Physiotherapy improves posture, mobility, and physical confidence for daily life.",
      bn: "ফিজিওথেরাপি দৈনন্দিন জীবনের জন্য ভঙ্গিমা, চলাচল ও শারীরিক আত্মবিশ্বাস বাড়ায়।",
    },
    how: {
      en: "Assessment, exercise plans, and progress tracking across sessions.",
      bn: "মূল্যায়ন, ব্যায়াম পরিকল্পনা ও সেশন জুড়ে অগ্রগতি ট্র্যাকিং।",
    },
    benefits: [
      { en: "Improved mobility", bn: "উন্নত চলাচল" },
      { en: "Stronger balance", bn: "শক্তিশালী ভারসাম্য" },
      { en: "Safe activity play", bn: "নিরাপদ খেলাধুলা" },
    ],
  },
  {
    slug: "psychological-counseling",
    name: { en: "Psychological Counseling", bn: "মনস্তাত্ত্বিক কাউন্সেলিং" },
    summary: {
      en: "Emotional regulation, confidence, and healthy coping strategies.",
      bn: "আবেগ নিয়ন্ত্রণ, আত্মবিশ্বাস ও সুস্থ মোকাবিলা কৌশল।",
    },
    what: {
      en: "A safe space for children and caregivers to build emotional wellbeing.",
      bn: "শিশু ও অভিভাবকদের মানসিক সুস্থতা গড়ার নিরাপদ জায়গা।",
    },
    how: {
      en: "Individual sessions, caregiver guidance, and coordinated plans with therapy teams.",
      bn: "ব্যক্তিগত সেশন, অভিভাবক নির্দেশনা ও থেরাপি দলের সাথে সমন্বিত পরিকল্পনা।",
    },
    benefits: [
      { en: "Emotional skills", bn: "আবেগিক দক্ষতা" },
      { en: "Family support", bn: "পরিবার সহায়তা" },
      { en: "Confidence growth", bn: "আত্মবিশ্বাস বৃদ্ধি" },
    ],
  },
  {
    slug: "behavior-management",
    name: { en: "Behavior Management", bn: "আচরণ ব্যবস্থাপনা" },
    summary: {
      en: "Identify triggers, teach replacement behaviors, build positive habits.",
      bn: "ট্রিগার চিহ্নিত করা, বিকল্প আচরণ শেখানো, ইতিবাচক অভ্যাস গড়া।",
    },
    what: {
      en: "Behavior support plans reduce challenging moments and grow helpful routines.",
      bn: "আচরণ সহায়তা পরিকল্পনা চ্যালেঞ্জিং মুহূর্ত কমায় ও সহায়ক রুটিন বাড়ায়।",
    },
    how: {
      en: "Observation, function-based strategies, and consistent team response.",
      bn: "পর্যবেক্ষণ, ফাংশন-ভিত্তিক কৌশল ও ধারাবাহিক দলীয় সাড়া।",
    },
    benefits: [
      { en: "Clear routines", bn: "স্পষ্ট রুটিন" },
      { en: "Safer learning", bn: "নিরাপদ শেখা" },
      { en: "Parent tools", bn: "অভিভাবক টুলস" },
    ],
  },
  {
    slug: "comprehensive-assessment",
    name: { en: "Assessment & Diagnosis", bn: "মূল্যায়ন ও নির্ণয়" },
    summary: {
      en: "Child-friendly evaluation before creating a personalized support plan.",
      bn: "ব্যক্তিগত সহায়তা পরিকল্পনার আগে শিশু-বান্ধব মূল্যায়ন।",
    },
    what: {
      en: "We observe strengths, needs, and pace of learning to guide therapy and school placement.",
      bn: "থেরাপি ও স্কুল প্লেসমেন্ট নির্দেশে আমরা শক্তি, চাহিদা ও শেখার গতি পর্যবেক্ষণ করি।",
    },
    how: {
      en: "Intake interview, clinical observation, recommendations, and family feedback meeting.",
      bn: "ইনটেক সাক্ষাৎকার, ক্লিনিকাল পর্যবেক্ষণ, সুপারিশ ও পরিবার ফিডব্যাক মিটিং।",
    },
    benefits: [
      { en: "Clear next steps", bn: "স্পষ্ট পরবর্তী পদক্ষেপ" },
      { en: "Personalized plan", bn: "ব্যক্তিগত পরিকল্পনা" },
      { en: "Family clarity", bn: "পরিবারের স্বচ্ছতা" },
    ],
    featured: true,
  },
];

export function getTherapy(slug: string) {
  return therapies.find((t) => t.slug === slug);
}
