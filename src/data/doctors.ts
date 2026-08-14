import type { Localized } from "./departments";

export type Doctor = {
  slug: string;
  name: Localized;
  title: Localized;
  departmentSlug: string;
  hub: "medical" | "autism" | "both";
  bio: Localized;
  schedule: Localized;
};

export const doctors: Doctor[] = [
  {
    slug: "dr-rahman",
    name: { en: "Dr. Ayesha Rahman", bn: "ডা. আয়েশা রহমান" },
    title: { en: "Consultant Cardiologist", bn: "কনসালট্যান্ট কার্ডিওলজিস্ট" },
    departmentSlug: "cardiology",
    hub: "medical",
    bio: {
      en: "Specializes in preventive cardiology and complex heart disease management with over 15 years of experience.",
      bn: "১৫ বছরেরও বেশি অভিজ্ঞতায় প্রতিরোধমূলক কার্ডিওলজি ও জটিল হৃদরোগ ব্যবস্থাপনায় বিশেষজ্ঞ।",
    },
    schedule: { en: "Sun–Thu 9:00 AM – 2:00 PM", bn: "রবি–বৃহ ৯:০০ পূর্বাহ্ন – ২:০০ অপরাহ্ন" },
  },
  {
    slug: "dr-karim",
    name: { en: "Dr. Farhan Karim", bn: "ডা. ফারহান করিম" },
    title: { en: "Pediatrician", bn: "শিশু বিশেষজ্ঞ" },
    departmentSlug: "pediatrics",
    hub: "both",
    bio: {
      en: "Focuses on child development, immunization, and coordinated care with autism therapy teams.",
      bn: "শিশু বিকাশ, টিকাদান এবং অটিজম থেরাপি দলের সাথে সমন্বিত সেবায় মনোযোগী।",
    },
    schedule: { en: "Sat–Wed 10:00 AM – 4:00 PM", bn: "শনি–বুধ ১০:০০ পূর্বাহ্ন – ৪:০০ অপরাহ্ন" },
  },
  {
    slug: "dr-sultana",
    name: { en: "Dr. Nadia Sultana", bn: "ডা. নাদিয়া সুলতানা" },
    title: { en: "Neurologist", bn: "নিউরোলজিস্ট" },
    departmentSlug: "neurology",
    hub: "both",
    bio: {
      en: "Provides neurological assessment for children and adults, including developmental neurology referrals.",
      bn: "শিশু ও প্রাপ্তবয়স্কদের স্নায়বিক মূল্যায়নসহ বিকাশজনিত নিউরোলজি রেফারেল প্রদান করেন।",
    },
    schedule: { en: "Mon–Thu 11:00 AM – 5:00 PM", bn: "সোম–বৃহ ১১:০০ পূর্বাহ্ন – ৫:০০ অপরাহ্ন" },
  },
  {
    slug: "dr-hossain",
    name: { en: "Dr. Imran Hossain", bn: "ডা. ইমরান হোসেন" },
    title: { en: "Orthopedic Surgeon", bn: "অর্থোপেডিক সার্জন" },
    departmentSlug: "orthopedics",
    hub: "medical",
    bio: {
      en: "Experienced in trauma, joint care, and rehabilitation planning with physiotherapy.",
      bn: "ট্রমা, জয়েন্ট কেয়ার এবং ফিজিওথেরাপির সাথে পুনর্বাসন পরিকল্পনায় অভিজ্ঞ।",
    },
    schedule: { en: "Sun–Tue 8:30 AM – 1:00 PM", bn: "রবি–মঙ্গল ৮:৩০ পূর্বাহ্ন – ১:০০ অপরাহ্ন" },
  },
  {
    slug: "ms-jahan",
    name: { en: "Ms. Rina Jahan", bn: "মিস রিনা জাহান" },
    title: { en: "Lead ABA Therapist", bn: "লিড এবিএ থেরাপিস্ট" },
    departmentSlug: "pediatrics",
    hub: "autism",
    bio: {
      en: "Designs individualized ABA programs focused on communication, social skills, and daily living.",
      bn: "যোগাযোগ, সামাজিক দক্ষতা ও দৈনন্দিন জীবনকেন্দ্রিক ব্যক্তিগত এবিএ প্রোগ্রাম তৈরি করেন।",
    },
    schedule: { en: "Shifts: Morning & Afternoon", bn: "শিফট: সকাল ও বিকেল" },
  },
  {
    slug: "ms-akhtar",
    name: { en: "Ms. Farzana Akhtar", bn: "মিস ফারজানা আখতার" },
    title: { en: "Speech & Language Therapist", bn: "স্পিচ ও ল্যাঙ্গুয়েজ থেরাপিস্ট" },
    departmentSlug: "pediatrics",
    hub: "autism",
    bio: {
      en: "Helps children communicate through speech, gestures, and assistive tools with family coaching.",
      bn: "পরিবার কোচিংসহ কথা, ইঙ্গিত ও সহায়ক সরঞ্জামের মাধ্যমে শিশুদের যোগাযোগে সহায়তা করেন।",
    },
    schedule: { en: "Sat–Thu by appointment", bn: "শনি–বৃহ অ্যাপয়েন্টমেন্ট অনুসারে" },
  },
];

export function getDoctor(slug: string) {
  return doctors.find((d) => d.slug === slug);
}
