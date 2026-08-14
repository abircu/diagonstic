import type { Localized } from "./departments";

export type FaqItem = {
  id: string;
  category: "general" | "therapy" | "medical" | "safety";
  question: Localized;
  answer: Localized;
};

export const faqs: FaqItem[] = [
  {
    id: "who",
    category: "general",
    question: {
      en: "Who can enroll in the autism school?",
      bn: "অটিজম স্কুলে কে ভর্তি হতে পারে?",
    },
    answer: {
      en: "Children with autism spectrum disorder or related developmental delays may apply. Placement follows assessment, not age alone.",
      bn: "অটিজম স্পেকট্রাম ডিসঅর্ডার বা সংশ্লিষ্ট বিকাশজনিত বিলম্বযুক্ত শিশুরা আবেদন করতে পারে। প্লেসমেন্ট শুধু বয়স নয়, মূল্যায়ন অনুসারে হয়।",
    },
  },
  {
    id: "shifts",
    category: "therapy",
    question: {
      en: "Do you offer flexible therapy shifts?",
      bn: "আপনারা কি নমনীয় থেরাপি শিফট দেন?",
    },
    answer: {
      en: "Yes. We offer multiple daily shifts so families can choose a schedule that fits work and school routines.",
      bn: "হ্যাঁ। পরিবার যাতে কাজ ও স্কুল রুটিনের সাথে মানানসই সময় বেছে নিতে পারে সেজন্য একাধিক দৈনিক শিফট আছে।",
    },
  },
  {
    id: "appointment",
    category: "medical",
    question: {
      en: "How do I book a doctor appointment?",
      bn: "ডাক্তার অ্যাপয়েন্টমেন্ট কীভাবে বুক করব?",
    },
    answer: {
      en: "Use the online appointment form, call our medical hotline, or visit the OPD desk during open hours.",
      bn: "অনলাইন অ্যাপয়েন্টমেন্ট ফর্ম ব্যবহার করুন, মেডিকেল হটলাইনে কল করুন, বা খোলার সময়ে ওপিডি ডেস্কে আসুন।",
    },
  },
  {
    id: "iep",
    category: "therapy",
    question: {
      en: "Do students get an Individualized Education Plan?",
      bn: "শিক্ষার্থীরা কি ব্যক্তিগত শিক্ষা পরিকল্পনা পায়?",
    },
    answer: {
      en: "Yes. Each enrolled child receives an IEP with therapy goals, academic targets, and monthly family review.",
      bn: "হ্যাঁ। প্রতিটি ভর্তিকৃত শিশু থেরাপি লক্ষ্য, একাডেমিক টার্গেট ও মাসিক পরিবার পর্যালোচনাসহ আইইপি পায়।",
    },
  },
  {
    id: "safety",
    category: "safety",
    question: {
      en: "How do you keep the campus safe?",
      bn: "ক্যাম্পাস কীভাবে নিরাপদ রাখা হয়?",
    },
    answer: {
      en: "Classrooms are CCTV-monitored, staff are trained, and visitor access is controlled.",
      bn: "শ্রেণিকক্ষ সিসিটিভি-নিরীক্ষিত, কর্মীরা প্রশিক্ষিত এবং দর্শনার্থী প্রবেশ নিয়ন্ত্রিত।",
    },
  },
  {
    id: "packages",
    category: "medical",
    question: {
      en: "What is included in health check-up packages?",
      bn: "হেলথ চেক-আপ প্যাকেজে কী থাকে?",
    },
    answer: {
      en: "Packages typically include physician consult, lab panels, and selected imaging. See the Packages page for details.",
      bn: "প্যাকেজে সাধারণত চিকিৎসক পরামর্শ, ল্যাব প্যানেল ও নির্বাচিত ইমেজিং থাকে। বিস্তারিত প্যাকেজ পৃষ্ঠায় দেখুন।",
    },
  },
];

export type Testimonial = {
  id: string;
  quote: Localized;
  author: Localized;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote: {
      en: "After months of speech therapy and ABA, our son now tells us about his day. The team truly cares.",
      bn: "কয়েক মাস স্পিচ থেরাপি ও এবিএর পর আমাদের ছেলে এখন তার দিনের কথা বলে। দলটি সত্যিই যত্নশীল।",
    },
    author: { en: "Parent of a 6-year-old", bn: "৬ বছর বয়সী শিশুর অভিভাবক" },
  },
  {
    id: "t2",
    quote: {
      en: "Booking an appointment was simple, and the cardiology team explained every step clearly.",
      bn: "অ্যাপয়েন্টমেন্ট বুকিং সহজ ছিল এবং কার্ডিওলজি দল প্রতিটি ধাপ স্পষ্টভাবে ব্যাখ্যা করেছে।",
    },
    author: { en: "Cardiac patient, Sirajganj", bn: "কার্ডিয়াক রোগী, সিরাজগঞ্জ" },
  },
  {
    id: "t3",
    quote: {
      en: "Therapy and school under one roof means our daughter’s plan finally feels consistent.",
      bn: "এক ছাদের নিচে থেরাপি ও স্কুল মানে আমাদের মেয়ের পরিকল্পনা অবশেষে ধারাবাহিক মনে হয়।",
    },
    author: { en: "Parent, student since 2024", bn: "অভিভাবক, ২০২৪ থেকে শিক্ষার্থী" },
  },
];

export type GalleryItem = {
  id: string;
  title: Localized;
  kind: "photo" | "video";
};

export const galleryItems: GalleryItem[] = [
  { id: "g1", title: { en: "Hospital campus", bn: "হাসপাতাল ক্যাম্পাস" }, kind: "photo" },
  { id: "g2", title: { en: "Therapy classroom", bn: "থেরাপি শ্রেণিকক্ষ" }, kind: "photo" },
  { id: "g3", title: { en: "Diagnostic suite", bn: "ডায়াগনস্টিক স্যুট" }, kind: "photo" },
  { id: "g4", title: { en: "Outdoor activities", bn: "বহিরঙ্গন কার্যক্রম" }, kind: "photo" },
  { id: "g5", title: { en: "Parent orientation", bn: "অভিভাবক ওরিয়েন্টেশন" }, kind: "video" },
  { id: "g6", title: { en: "Community day", bn: "কমিউনিটি ডে" }, kind: "photo" },
];
