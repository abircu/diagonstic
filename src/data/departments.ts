export type Localized = { en: string; bn: string };

export type Department = {
  slug: string;
  name: Localized;
  group: "medicine" | "surgery" | "gynae" | "investigation" | "dental";
  summary: Localized;
  body: Localized;
};

export const departments: Department[] = [
  {
    slug: "cardiology",
    name: { en: "Cardiology", bn: "কার্ডিওলজি" },
    group: "medicine",
    summary: {
      en: "Heart diagnostics and compassionate cardiac care.",
      bn: "হৃদরোগ নির্ণয় ও সহানুভূতিশীল কার্ডিয়াক সেবা।",
    },
    body: {
      en: "Our cardiology team delivers advanced diagnostics, medical management, and coordinated care with cardiac surgery for acute and chronic heart conditions.",
      bn: "আমাদের কার্ডিওলজি দল উন্নত ডায়াগনস্টিক্স, চিকিৎসা ব্যবস্থাপনা এবং কার্ডিয়াক সার্জারির সাথে সমন্বিত সেবা প্রদান করে।",
    },
  },
  {
    slug: "pediatrics",
    name: { en: "Pediatrics", bn: "শিশু স্বাস্থ্য" },
    group: "medicine",
    summary: {
      en: "Child-focused medicine from infancy through adolescence.",
      bn: "শৈশব থেকে কৈশোর পর্যন্ত শিশুকেন্দ্রিক চিকিৎসা।",
    },
    body: {
      en: "Pediatricians work closely with autism therapy teams when developmental concerns arise, ensuring medical and developmental plans stay aligned.",
      bn: "বিকাশগত সমস্যা দেখা দিলে শিশু বিশেষজ্ঞরা অটিজম থেরাপি দলের সাথে ঘনিষ্ঠভাবে কাজ করেন।",
    },
  },
  {
    slug: "neurology",
    name: { en: "Neuro Medicine", bn: "নিউরো মেডিসিন" },
    group: "medicine",
    summary: {
      en: "Brain and nerve care with modern diagnostics.",
      bn: "আধুনিক ডায়াগনস্টিকসহ মস্তিষ্ক ও স্নায়ু সেবা।",
    },
    body: {
      en: "Neurology supports seizure management, developmental neurology referrals, and collaboration with rehabilitation and autism programs.",
      bn: "নিউরোলজি সিজার ব্যবস্থাপনা, বিকাশজনিত নিউরোলজি রেফারেল এবং পুনর্বাসন ও অটিজম প্রোগ্রামের সাথে সহযোগিতা করে।",
    },
  },
  {
    slug: "psychiatry",
    name: { en: "Psychiatry", bn: "সাইকিয়াট্রি" },
    group: "medicine",
    summary: {
      en: "Mental health support for patients and families.",
      bn: "রোগী ও পরিবারের জন্য মানসিক স্বাস্থ্য সহায়তা।",
    },
    body: {
      en: "Psychiatry partners with counseling and behavior teams for integrated emotional and behavioral care across ages.",
      bn: "সব বয়সের জন্য সমন্বিত আবেগ ও আচরণগত সেবায় সাইকিয়াট্রি কাউন্সেলিং ও বিহেভিয়ার দলের সাথে কাজ করে।",
    },
  },
  {
    slug: "orthopedics",
    name: { en: "Orthopedic Surgery", bn: "অর্থোপেডিক সার্জারি" },
    group: "surgery",
    summary: {
      en: "Bone, joint, and mobility surgical care.",
      bn: "হাড়, জয়েন্ট ও চলাচলের অস্ত্রোপচার সেবা।",
    },
    body: {
      en: "Orthopedics coordinates with physiotherapy and the limb center for recovery, braces, and long-term mobility goals.",
      bn: "অর্থোপেডিক্স ফিজিওথেরাপি ও লিম্ব সেন্টারের সাথে পুনরুদ্ধার, ব্রেস ও দীর্ঘমেয়াদি চলাচল লক্ষ্যে সমন্বয় করে।",
    },
  },
  {
    slug: "neurosurgery",
    name: { en: "Neurosurgery", bn: "নিউরোসার্জারি" },
    group: "surgery",
    summary: {
      en: "Specialist surgical care for brain and spine.",
      bn: "মস্তিষ্ক ও মেরুদণ্ডের বিশেষজ্ঞ অস্ত্রোপচার সেবা।",
    },
    body: {
      en: "Neurosurgery combines skilled specialists with advanced techniques to optimize neurological outcomes.",
      bn: "নিউরোসার্জারি দক্ষ বিশেষজ্ঞ ও উন্নত কৌশল একত্র করে স্নায়বিক ফলাফল উন্নত করে।",
    },
  },
  {
    slug: "emergency",
    name: { en: "Emergency & Casualty", bn: "জরুরি ও ক্যাজুয়ালিটি" },
    group: "surgery",
    summary: {
      en: "24×7 emergency response and stabilization.",
      bn: "২৪×৭ জরুরি সাড়া ও স্থিতিশীলকরণ।",
    },
    body: {
      en: "Our emergency unit provides rapid triage, ambulance coordination, and critical care pathways around the clock.",
      bn: "আমাদের জরুরি ইউনিট দ্রুত ট্রায়াজ, অ্যাম্বুলেন্স সমন্বয় ও ঘড়ির চারপাশে ক্রিটিক্যাল কেয়ার পথ প্রদান করে।",
    },
  },
  {
    slug: "obgyn",
    name: { en: "Obstetrics & Gynecology", bn: "প্রসূতি ও স্ত্রীরোগ" },
    group: "gynae",
    summary: {
      en: "Women’s health, pregnancy, and delivery care.",
      bn: "নারী স্বাস্থ্য, গর্ভধারণ ও প্রসব সেবা।",
    },
    body: {
      en: "From antenatal check-ups to safe delivery and postnatal support, our OB-GYN team provides continuous care.",
      bn: "প্রসবপূর্ব চেকআপ থেকে নিরাপদ প্রসব ও প্রসবোত্তর সহায়তা পর্যন্ত আমাদের ওবি-জাইনি দল ধারাবাহিক সেবা দেয়।",
    },
  },
  {
    slug: "radiology",
    name: { en: "Radiology & Imaging", bn: "রেডিওলজি ও ইমেজিং" },
    group: "investigation",
    summary: {
      en: "MRI, CT, X-ray, ultrasound, and mammography.",
      bn: "এমআরআই, সিটি, এক্স-রে, আল্ট্রাসাউন্ড ও ম্যামোগ্রাফি।",
    },
    body: {
      en: "Imaging specialists deliver accurate diagnostics that guide treatment across medical and surgical departments.",
      bn: "ইমেজিং বিশেষজ্ঞরা সঠিক নির্ণয় দেন যা মেডিকেল ও সার্জিক্যাল বিভাগে চিকিৎসা নির্দেশ করে।",
    },
  },
  {
    slug: "laboratory",
    name: { en: "Laboratory Services", bn: "ল্যাবরেটরি সেবা" },
    group: "investigation",
    summary: {
      en: "Reliable pathology and clinical lab testing.",
      bn: "নির্ভরযোগ্য প্যাথলজি ও ক্লিনিকাল ল্যাব পরীক্ষা।",
    },
    body: {
      en: "Our labs support early detection, monitoring, and executive health packages with quality-controlled workflows.",
      bn: "আমাদের ল্যাব মান নিয়ন্ত্রিত ওয়ার্কফ্লোতে প্রাথমিক সনাক্তকরণ, পর্যবেক্ষণ ও হেলথ প্যাকেজ সমর্থন করে।",
    },
  },
  {
    slug: "dentistry",
    name: { en: "Dental Unit", bn: "ডেন্টাল ইউনিট" },
    group: "dental",
    summary: {
      en: "Comprehensive oral healthcare for all ages.",
      bn: "সব বয়সের জন্য সমন্বিত মুখ ও দাঁতের সেবা।",
    },
    body: {
      en: "From preventive dentistry to oral surgery, our dental professionals use modern techniques for comfortable care.",
      bn: "প্রতিরোধমূলক দন্তচিকিৎসা থেকে ওরাল সার্জারি পর্যন্ত আমাদের দন্ত পেশাজীবীরা আধুনিক কৌশল ব্যবহার করেন।",
    },
  },
];

export function getDepartment(slug: string) {
  return departments.find((d) => d.slug === slug);
}
