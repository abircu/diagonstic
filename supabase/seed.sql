-- Auto-generated seed — run AFTER schema.sql
-- npx tsx scripts/generate-seed.ts

delete from public.ambulance_requests;
delete from public.assessment_requests;
delete from public.appointment_requests;
delete from public.sliders;
delete from public.gallery_items;
delete from public.testimonials;
delete from public.faqs;
delete from public.stats;
delete from public.packages;
delete from public.diagnostics;
delete from public.specialties;
delete from public.programs;
delete from public.therapies;
delete from public.doctors;
delete from public.departments;
delete from public.site_settings;

insert into public.site_settings (
  id, brand, brand_short, tagline,
  phone_main, phone_main_display, phone_medical, phone_medical_display,
  phone_admission, phone_admission_display, email_info, email_admission,
  address, hours, social
) values (
  1,
  'Daig Medical & Autism Care',
  'Daig',
  '{"en":"Hospital care and autism support under one roof","bn":"এক ছাদের নিচে হাসপাতাল সেবা ও অটিজম সহায়তা"}'::jsonb,
  '+8801615335292',
  '+880 1615 335 292',
  '+8809677602660',
  '+880 9677 602 660',
  '+8801726065473',
  '+880 1726 065 473',
  'info@daig.example.com',
  'admission@daig.example.com',
  '{"en":"Enayetpur Road Campus, Sirajganj & South Banasree Outreach, Dhaka","bn":"এনায়েতপুর রোড ক্যাম্পাস, সিরাজগঞ্জ ও সাউথ বনশ্রী আউটরিচ, ঢাকা"}'::jsonb,
  '{"en":"OPD 8:30 AM – 5:30 PM · IPD 24×7 · Therapy shifts available","bn":"ওপিডি ৮:৩০ পূর্বাহ্ন – ৫:৩০ অপরাহ্ন · আইপিডি ২৪×৭ · থেরাপি শিফট উপলব্ধ"}'::jsonb,
  '{"facebook":"https://facebook.com","youtube":"https://youtube.com"}'::jsonb
);

insert into public.departments (slug, name, group_key, summary, body, sort_order) values (
  'cardiology', '{"en":"Cardiology","bn":"কার্ডিওলজি"}'::jsonb, 'medicine', '{"en":"Heart diagnostics and compassionate cardiac care.","bn":"হৃদরোগ নির্ণয় ও সহানুভূতিশীল কার্ডিয়াক সেবা।"}'::jsonb, '{"en":"Our cardiology team delivers advanced diagnostics, medical management, and coordinated care with cardiac surgery for acute and chronic heart conditions.","bn":"আমাদের কার্ডিওলজি দল উন্নত ডায়াগনস্টিক্স, চিকিৎসা ব্যবস্থাপনা এবং কার্ডিয়াক সার্জারির সাথে সমন্বিত সেবা প্রদান করে।"}'::jsonb, 0
);
insert into public.departments (slug, name, group_key, summary, body, sort_order) values (
  'pediatrics', '{"en":"Pediatrics","bn":"শিশু স্বাস্থ্য"}'::jsonb, 'medicine', '{"en":"Child-focused medicine from infancy through adolescence.","bn":"শৈশব থেকে কৈশোর পর্যন্ত শিশুকেন্দ্রিক চিকিৎসা।"}'::jsonb, '{"en":"Pediatricians work closely with autism therapy teams when developmental concerns arise, ensuring medical and developmental plans stay aligned.","bn":"বিকাশগত সমস্যা দেখা দিলে শিশু বিশেষজ্ঞরা অটিজম থেরাপি দলের সাথে ঘনিষ্ঠভাবে কাজ করেন।"}'::jsonb, 1
);
insert into public.departments (slug, name, group_key, summary, body, sort_order) values (
  'neurology', '{"en":"Neuro Medicine","bn":"নিউরো মেডিসিন"}'::jsonb, 'medicine', '{"en":"Brain and nerve care with modern diagnostics.","bn":"আধুনিক ডায়াগনস্টিকসহ মস্তিষ্ক ও স্নায়ু সেবা।"}'::jsonb, '{"en":"Neurology supports seizure management, developmental neurology referrals, and collaboration with rehabilitation and autism programs.","bn":"নিউরোলজি সিজার ব্যবস্থাপনা, বিকাশজনিত নিউরোলজি রেফারেল এবং পুনর্বাসন ও অটিজম প্রোগ্রামের সাথে সহযোগিতা করে।"}'::jsonb, 2
);
insert into public.departments (slug, name, group_key, summary, body, sort_order) values (
  'psychiatry', '{"en":"Psychiatry","bn":"সাইকিয়াট্রি"}'::jsonb, 'medicine', '{"en":"Mental health support for patients and families.","bn":"রোগী ও পরিবারের জন্য মানসিক স্বাস্থ্য সহায়তা।"}'::jsonb, '{"en":"Psychiatry partners with counseling and behavior teams for integrated emotional and behavioral care across ages.","bn":"সব বয়সের জন্য সমন্বিত আবেগ ও আচরণগত সেবায় সাইকিয়াট্রি কাউন্সেলিং ও বিহেভিয়ার দলের সাথে কাজ করে।"}'::jsonb, 3
);
insert into public.departments (slug, name, group_key, summary, body, sort_order) values (
  'orthopedics', '{"en":"Orthopedic Surgery","bn":"অর্থোপেডিক সার্জারি"}'::jsonb, 'surgery', '{"en":"Bone, joint, and mobility surgical care.","bn":"হাড়, জয়েন্ট ও চলাচলের অস্ত্রোপচার সেবা।"}'::jsonb, '{"en":"Orthopedics coordinates with physiotherapy and the limb center for recovery, braces, and long-term mobility goals.","bn":"অর্থোপেডিক্স ফিজিওথেরাপি ও লিম্ব সেন্টারের সাথে পুনরুদ্ধার, ব্রেস ও দীর্ঘমেয়াদি চলাচল লক্ষ্যে সমন্বয় করে।"}'::jsonb, 4
);
insert into public.departments (slug, name, group_key, summary, body, sort_order) values (
  'neurosurgery', '{"en":"Neurosurgery","bn":"নিউরোসার্জারি"}'::jsonb, 'surgery', '{"en":"Specialist surgical care for brain and spine.","bn":"মস্তিষ্ক ও মেরুদণ্ডের বিশেষজ্ঞ অস্ত্রোপচার সেবা।"}'::jsonb, '{"en":"Neurosurgery combines skilled specialists with advanced techniques to optimize neurological outcomes.","bn":"নিউরোসার্জারি দক্ষ বিশেষজ্ঞ ও উন্নত কৌশল একত্র করে স্নায়বিক ফলাফল উন্নত করে।"}'::jsonb, 5
);
insert into public.departments (slug, name, group_key, summary, body, sort_order) values (
  'emergency', '{"en":"Emergency & Casualty","bn":"জরুরি ও ক্যাজুয়ালিটি"}'::jsonb, 'surgery', '{"en":"24×7 emergency response and stabilization.","bn":"২৪×৭ জরুরি সাড়া ও স্থিতিশীলকরণ।"}'::jsonb, '{"en":"Our emergency unit provides rapid triage, ambulance coordination, and critical care pathways around the clock.","bn":"আমাদের জরুরি ইউনিট দ্রুত ট্রায়াজ, অ্যাম্বুলেন্স সমন্বয় ও ঘড়ির চারপাশে ক্রিটিক্যাল কেয়ার পথ প্রদান করে।"}'::jsonb, 6
);
insert into public.departments (slug, name, group_key, summary, body, sort_order) values (
  'obgyn', '{"en":"Obstetrics & Gynecology","bn":"প্রসূতি ও স্ত্রীরোগ"}'::jsonb, 'gynae', '{"en":"Women’s health, pregnancy, and delivery care.","bn":"নারী স্বাস্থ্য, গর্ভধারণ ও প্রসব সেবা।"}'::jsonb, '{"en":"From antenatal check-ups to safe delivery and postnatal support, our OB-GYN team provides continuous care.","bn":"প্রসবপূর্ব চেকআপ থেকে নিরাপদ প্রসব ও প্রসবোত্তর সহায়তা পর্যন্ত আমাদের ওবি-জাইনি দল ধারাবাহিক সেবা দেয়।"}'::jsonb, 7
);
insert into public.departments (slug, name, group_key, summary, body, sort_order) values (
  'radiology', '{"en":"Radiology & Imaging","bn":"রেডিওলজি ও ইমেজিং"}'::jsonb, 'investigation', '{"en":"MRI, CT, X-ray, ultrasound, and mammography.","bn":"এমআরআই, সিটি, এক্স-রে, আল্ট্রাসাউন্ড ও ম্যামোগ্রাফি।"}'::jsonb, '{"en":"Imaging specialists deliver accurate diagnostics that guide treatment across medical and surgical departments.","bn":"ইমেজিং বিশেষজ্ঞরা সঠিক নির্ণয় দেন যা মেডিকেল ও সার্জিক্যাল বিভাগে চিকিৎসা নির্দেশ করে।"}'::jsonb, 8
);
insert into public.departments (slug, name, group_key, summary, body, sort_order) values (
  'laboratory', '{"en":"Laboratory Services","bn":"ল্যাবরেটরি সেবা"}'::jsonb, 'investigation', '{"en":"Reliable pathology and clinical lab testing.","bn":"নির্ভরযোগ্য প্যাথলজি ও ক্লিনিকাল ল্যাব পরীক্ষা।"}'::jsonb, '{"en":"Our labs support early detection, monitoring, and executive health packages with quality-controlled workflows.","bn":"আমাদের ল্যাব মান নিয়ন্ত্রিত ওয়ার্কফ্লোতে প্রাথমিক সনাক্তকরণ, পর্যবেক্ষণ ও হেলথ প্যাকেজ সমর্থন করে।"}'::jsonb, 9
);
insert into public.departments (slug, name, group_key, summary, body, sort_order) values (
  'dentistry', '{"en":"Dental Unit","bn":"ডেন্টাল ইউনিট"}'::jsonb, 'dental', '{"en":"Comprehensive oral healthcare for all ages.","bn":"সব বয়সের জন্য সমন্বিত মুখ ও দাঁতের সেবা।"}'::jsonb, '{"en":"From preventive dentistry to oral surgery, our dental professionals use modern techniques for comfortable care.","bn":"প্রতিরোধমূলক দন্তচিকিৎসা থেকে ওরাল সার্জারি পর্যন্ত আমাদের দন্ত পেশাজীবীরা আধুনিক কৌশল ব্যবহার করেন।"}'::jsonb, 10
);

insert into public.doctors (slug, name, title, department_slug, hub, bio, schedule, sort_order) values (
  'dr-rahman', '{"en":"Dr. Ayesha Rahman","bn":"ডা. আয়েশা রহমান"}'::jsonb, '{"en":"Consultant Cardiologist","bn":"কনসালট্যান্ট কার্ডিওলজিস্ট"}'::jsonb, 'cardiology', 'medical',
  '{"en":"Specializes in preventive cardiology and complex heart disease management with over 15 years of experience.","bn":"১৫ বছরেরও বেশি অভিজ্ঞতায় প্রতিরোধমূলক কার্ডিওলজি ও জটিল হৃদরোগ ব্যবস্থাপনায় বিশেষজ্ঞ।"}'::jsonb, '{"en":"Sun–Thu 9:00 AM – 2:00 PM","bn":"রবি–বৃহ ৯:০০ পূর্বাহ্ন – ২:০০ অপরাহ্ন"}'::jsonb, 0
);
insert into public.doctors (slug, name, title, department_slug, hub, bio, schedule, sort_order) values (
  'dr-karim', '{"en":"Dr. Farhan Karim","bn":"ডা. ফারহান করিম"}'::jsonb, '{"en":"Pediatrician","bn":"শিশু বিশেষজ্ঞ"}'::jsonb, 'pediatrics', 'both',
  '{"en":"Focuses on child development, immunization, and coordinated care with autism therapy teams.","bn":"শিশু বিকাশ, টিকাদান এবং অটিজম থেরাপি দলের সাথে সমন্বিত সেবায় মনোযোগী।"}'::jsonb, '{"en":"Sat–Wed 10:00 AM – 4:00 PM","bn":"শনি–বুধ ১০:০০ পূর্বাহ্ন – ৪:০০ অপরাহ্ন"}'::jsonb, 1
);
insert into public.doctors (slug, name, title, department_slug, hub, bio, schedule, sort_order) values (
  'dr-sultana', '{"en":"Dr. Nadia Sultana","bn":"ডা. নাদিয়া সুলতানা"}'::jsonb, '{"en":"Neurologist","bn":"নিউরোলজিস্ট"}'::jsonb, 'neurology', 'both',
  '{"en":"Provides neurological assessment for children and adults, including developmental neurology referrals.","bn":"শিশু ও প্রাপ্তবয়স্কদের স্নায়বিক মূল্যায়নসহ বিকাশজনিত নিউরোলজি রেফারেল প্রদান করেন।"}'::jsonb, '{"en":"Mon–Thu 11:00 AM – 5:00 PM","bn":"সোম–বৃহ ১১:০০ পূর্বাহ্ন – ৫:০০ অপরাহ্ন"}'::jsonb, 2
);
insert into public.doctors (slug, name, title, department_slug, hub, bio, schedule, sort_order) values (
  'dr-hossain', '{"en":"Dr. Imran Hossain","bn":"ডা. ইমরান হোসেন"}'::jsonb, '{"en":"Orthopedic Surgeon","bn":"অর্থোপেডিক সার্জন"}'::jsonb, 'orthopedics', 'medical',
  '{"en":"Experienced in trauma, joint care, and rehabilitation planning with physiotherapy.","bn":"ট্রমা, জয়েন্ট কেয়ার এবং ফিজিওথেরাপির সাথে পুনর্বাসন পরিকল্পনায় অভিজ্ঞ।"}'::jsonb, '{"en":"Sun–Tue 8:30 AM – 1:00 PM","bn":"রবি–মঙ্গল ৮:৩০ পূর্বাহ্ন – ১:০০ অপরাহ্ন"}'::jsonb, 3
);
insert into public.doctors (slug, name, title, department_slug, hub, bio, schedule, sort_order) values (
  'ms-jahan', '{"en":"Ms. Rina Jahan","bn":"মিস রিনা জাহান"}'::jsonb, '{"en":"Lead ABA Therapist","bn":"লিড এবিএ থেরাপিস্ট"}'::jsonb, 'pediatrics', 'autism',
  '{"en":"Designs individualized ABA programs focused on communication, social skills, and daily living.","bn":"যোগাযোগ, সামাজিক দক্ষতা ও দৈনন্দিন জীবনকেন্দ্রিক ব্যক্তিগত এবিএ প্রোগ্রাম তৈরি করেন।"}'::jsonb, '{"en":"Shifts: Morning & Afternoon","bn":"শিফট: সকাল ও বিকেল"}'::jsonb, 4
);
insert into public.doctors (slug, name, title, department_slug, hub, bio, schedule, sort_order) values (
  'ms-akhtar', '{"en":"Ms. Farzana Akhtar","bn":"মিস ফারজানা আখতার"}'::jsonb, '{"en":"Speech & Language Therapist","bn":"স্পিচ ও ল্যাঙ্গুয়েজ থেরাপিস্ট"}'::jsonb, 'pediatrics', 'autism',
  '{"en":"Helps children communicate through speech, gestures, and assistive tools with family coaching.","bn":"পরিবার কোচিংসহ কথা, ইঙ্গিত ও সহায়ক সরঞ্জামের মাধ্যমে শিশুদের যোগাযোগে সহায়তা করেন।"}'::jsonb, '{"en":"Sat–Thu by appointment","bn":"শনি–বৃহ অ্যাপয়েন্টমেন্ট অনুসারে"}'::jsonb, 5
);

insert into public.therapies (slug, name, summary, what, how, benefits, featured, sort_order) values (
  'aba-therapy', '{"en":"Applied Behavior Analysis (ABA)","bn":"অ্যাপ্লাইড বিহেভিয়ার অ্যানালিসিস (এবিএ)"}'::jsonb, '{"en":"One-on-one sessions that build communication, social behavior, and daily living skills.","bn":"যোগাযোগ, সামাজিক আচরণ ও দৈনন্দিন দক্ষতা গড়ার এক-এক সেশন।"}'::jsonb, '{"en":"ABA uses structured, data-led teaching to strengthen helpful skills and reduce barriers to learning.","bn":"এবিএ কাঠামোবদ্ধ, ডেটা-ভিত্তিক শিক্ষার মাধ্যমে সহায়ক দক্ষতা বাড়ায় ও শেখার বাধা কমায়।"}'::jsonb, '{"en":"Assessment, goal setting, daily sessions, progress review, and parent partnership.","bn":"মূল্যায়ন, লক্ষ্য নির্ধারণ, দৈনিক সেশন, অগ্রগতি পর্যালোচনা ও অভিভাবক অংশীদারিত্ব।"}'::jsonb,
  '[{"en":"Clear, measurable goals","bn":"স্পষ্ট, পরিমাপযোগ্য লক্ষ্য"},{"en":"Consistent daily structure","bn":"ধারাবাহিক দৈনিক কাঠামো"},{"en":"Family coaching included","bn":"পরিবার কোচিং অন্তর্ভুক্ত"}]'::jsonb, true, 0
);
insert into public.therapies (slug, name, summary, what, how, benefits, featured, sort_order) values (
  'speech-language-therapy', '{"en":"Speech & Language Therapy","bn":"স্পিচ ও ল্যাঙ্গুয়েজ থেরাপি"}'::jsonb, '{"en":"Helping children communicate through words, gestures, or assistive tools.","bn":"কথা, ইঙ্গিত বা সহায়ক সরঞ্জামের মাধ্যমে শিশুদের যোগাযোগে সাহায্য।"}'::jsonb, '{"en":"Speech therapy builds expressive and receptive language with practical session activities.","bn":"স্পিচ থেরাপি বাস্তব সেশন কার্যক্রমের মাধ্যমে প্রকাশক ও গ্রহণযোগ্য ভাষা গড়ে তোলে।"}'::jsonb, '{"en":"Play-based drills, AAC options when needed, and home practice plans.","bn":"খেলার মাধ্যমে অনুশীলন, প্রয়োজনে এএসি এবং বাড়ির অনুশীলন পরিকল্পনা।"}'::jsonb,
  '[{"en":"Stronger communication","bn":"শক্তিশালী যোগাযোগ"},{"en":"Social readiness","bn":"সামাজিক প্রস্তুতি"},{"en":"Parent strategies","bn":"অভিভাবক কৌশল"}]'::jsonb, true, 1
);
insert into public.therapies (slug, name, summary, what, how, benefits, featured, sort_order) values (
  'occupational-therapy', '{"en":"Occupational Therapy","bn":"অকুপেশনাল থেরাপি"}'::jsonb, '{"en":"Fine motor skills, sensory regulation, and self-care through guided play.","bn":"নির্দেশিত খেলার মাধ্যমে সূক্ষ্ম মোটর দক্ষতা, সেন্সরি নিয়ন্ত্রণ ও স্ব-যত্ন।"}'::jsonb, '{"en":"OT supports independence in dressing, writing, feeding, and sensory comfort.","bn":"ওটি পোশাক পরা, লেখা, খাওয়া ও সেন্সরি আরামে স্বাধীনতা সমর্থন করে।"}'::jsonb, '{"en":"Sensory profiles, motor goals, and classroom/home carryover.","bn":"সেন্সরি প্রোফাইল, মোটর লক্ষ্য এবং শ্রেণিকক্ষ/বাড়িতে প্রয়োগ।"}'::jsonb,
  '[{"en":"Better self-care","bn":"উন্নত স্ব-যত্ন"},{"en":"Sensory calm","bn":"সেন্সরি শান্তি"},{"en":"School readiness","bn":"স্কুল প্রস্তুতি"}]'::jsonb, true, 2
);
insert into public.therapies (slug, name, summary, what, how, benefits, featured, sort_order) values (
  'physiotherapy', '{"en":"Physiotherapy","bn":"ফিজিওথেরাপি"}'::jsonb, '{"en":"Strength, balance, and coordination through structured physical activities.","bn":"কাঠামোবদ্ধ শারীরিক কার্যক্রমে শক্তি, ভারসাম্য ও সমন্বয়।"}'::jsonb, '{"en":"Physiotherapy improves posture, mobility, and physical confidence for daily life.","bn":"ফিজিওথেরাপি দৈনন্দিন জীবনের জন্য ভঙ্গিমা, চলাচল ও শারীরিক আত্মবিশ্বাস বাড়ায়।"}'::jsonb, '{"en":"Assessment, exercise plans, and progress tracking across sessions.","bn":"মূল্যায়ন, ব্যায়াম পরিকল্পনা ও সেশন জুড়ে অগ্রগতি ট্র্যাকিং।"}'::jsonb,
  '[{"en":"Improved mobility","bn":"উন্নত চলাচল"},{"en":"Stronger balance","bn":"শক্তিশালী ভারসাম্য"},{"en":"Safe activity play","bn":"নিরাপদ খেলাধুলা"}]'::jsonb, false, 3
);
insert into public.therapies (slug, name, summary, what, how, benefits, featured, sort_order) values (
  'psychological-counseling', '{"en":"Psychological Counseling","bn":"মনস্তাত্ত্বিক কাউন্সেলিং"}'::jsonb, '{"en":"Emotional regulation, confidence, and healthy coping strategies.","bn":"আবেগ নিয়ন্ত্রণ, আত্মবিশ্বাস ও সুস্থ মোকাবিলা কৌশল।"}'::jsonb, '{"en":"A safe space for children and caregivers to build emotional wellbeing.","bn":"শিশু ও অভিভাবকদের মানসিক সুস্থতা গড়ার নিরাপদ জায়গা।"}'::jsonb, '{"en":"Individual sessions, caregiver guidance, and coordinated plans with therapy teams.","bn":"ব্যক্তিগত সেশন, অভিভাবক নির্দেশনা ও থেরাপি দলের সাথে সমন্বিত পরিকল্পনা।"}'::jsonb,
  '[{"en":"Emotional skills","bn":"আবেগিক দক্ষতা"},{"en":"Family support","bn":"পরিবার সহায়তা"},{"en":"Confidence growth","bn":"আত্মবিশ্বাস বৃদ্ধি"}]'::jsonb, false, 4
);
insert into public.therapies (slug, name, summary, what, how, benefits, featured, sort_order) values (
  'behavior-management', '{"en":"Behavior Management","bn":"আচরণ ব্যবস্থাপনা"}'::jsonb, '{"en":"Identify triggers, teach replacement behaviors, build positive habits.","bn":"ট্রিগার চিহ্নিত করা, বিকল্প আচরণ শেখানো, ইতিবাচক অভ্যাস গড়া।"}'::jsonb, '{"en":"Behavior support plans reduce challenging moments and grow helpful routines.","bn":"আচরণ সহায়তা পরিকল্পনা চ্যালেঞ্জিং মুহূর্ত কমায় ও সহায়ক রুটিন বাড়ায়।"}'::jsonb, '{"en":"Observation, function-based strategies, and consistent team response.","bn":"পর্যবেক্ষণ, ফাংশন-ভিত্তিক কৌশল ও ধারাবাহিক দলীয় সাড়া।"}'::jsonb,
  '[{"en":"Clear routines","bn":"স্পষ্ট রুটিন"},{"en":"Safer learning","bn":"নিরাপদ শেখা"},{"en":"Parent tools","bn":"অভিভাবক টুলস"}]'::jsonb, false, 5
);
insert into public.therapies (slug, name, summary, what, how, benefits, featured, sort_order) values (
  'comprehensive-assessment', '{"en":"Assessment & Diagnosis","bn":"মূল্যায়ন ও নির্ণয়"}'::jsonb, '{"en":"Child-friendly evaluation before creating a personalized support plan.","bn":"ব্যক্তিগত সহায়তা পরিকল্পনার আগে শিশু-বান্ধব মূল্যায়ন।"}'::jsonb, '{"en":"We observe strengths, needs, and pace of learning to guide therapy and school placement.","bn":"থেরাপি ও স্কুল প্লেসমেন্ট নির্দেশে আমরা শক্তি, চাহিদা ও শেখার গতি পর্যবেক্ষণ করি।"}'::jsonb, '{"en":"Intake interview, clinical observation, recommendations, and family feedback meeting.","bn":"ইনটেক সাক্ষাৎকার, ক্লিনিকাল পর্যবেক্ষণ, সুপারিশ ও পরিবার ফিডব্যাক মিটিং।"}'::jsonb,
  '[{"en":"Clear next steps","bn":"স্পষ্ট পরবর্তী পদক্ষেপ"},{"en":"Personalized plan","bn":"ব্যক্তিগত পরিকল্পনা"},{"en":"Family clarity","bn":"পরিবারের স্বচ্ছতা"}]'::jsonb, true, 6
);

insert into public.programs (slug, name, age, summary, offer, why, benefits, featured, sort_order) values (
  'early-intervention', '{"en":"Early Intervention Program","bn":"আর্লি ইন্টারভেনশন প্রোগ্রাম"}'::jsonb, '{"en":"Ages 2–5","bn":"বয়স ২–৫"}'::jsonb, '{"en":"Developing speech, motor, and social skills through guided play.","bn":"নির্দেশিত খেলার মাধ্যমে কথা, মোটর ও সামাজিক দক্ষতা গড়া।"}'::jsonb,
  '{"en":"Play-based learning, therapy integration, and caregiver coaching for school-ready foundations.","bn":"খেলার মাধ্যমে শেখা, থেরাপি সমন্বয় ও স্কুল-প্রস্তুত ভিত্তির জন্য অভিভাবক কোচিং।"}'::jsonb, '{"en":"Early support helps children build skills faster during critical developmental windows.","bn":"গুরুত্বপূর্ণ বিকাশকালে আগাম সহায়তা শিশুদের দ্রুত দক্ষতা গড়তে সাহায্য করে।"}'::jsonb, '[{"en":"Speech & motor growth","bn":"কথা ও মোটর বৃদ্ধি"},{"en":"Social confidence","bn":"সামাজিক আত্মবিশ্বাস"},{"en":"Family routines","bn":"পরিবার রুটিন"}]'::jsonb, true, 0
);
insert into public.programs (slug, name, age, summary, offer, why, benefits, featured, sort_order) values (
  'pre-schooling', '{"en":"Pre-Schooling Program","bn":"প্রি-স্কুলিং প্রোগ্রাম"}'::jsonb, '{"en":"School-ready skills","bn":"স্কুল-প্রস্তুত দক্ষতা"}'::jsonb, '{"en":"Structured classroom routines that prepare children for learning groups.","bn":"শেখার গ্রুপের জন্য শিশুদের প্রস্তুত করা কাঠামোবদ্ধ শ্রেণিকক্ষ রুটিন।"}'::jsonb,
  '{"en":"Circle time, fine motor work, language groups, and therapy pull-outs as needed.","bn":"সার্কেল টাইম, সূক্ষ্ম মোটর কাজ, ভাষা গ্রুপ এবং প্রয়োজনে থেরাপি পুল-আউট।"}'::jsonb, '{"en":"Predictable structure helps children transition into more formal learning.","bn":"পূর্বানুমানযোগ্য কাঠামো শিশুদের আরও আনুষ্ঠানিক শিক্ষায় স্থানান্তরে সাহায্য করে।"}'::jsonb, '[{"en":"Classroom readiness","bn":"শ্রেণিকক্ষ প্রস্তুতি"},{"en":"Peer interaction","bn":"সহপাঠী মিথস্ক্রিয়া"},{"en":"Attention skills","bn":"মনোযোগ দক্ষতা"}]'::jsonb, true, 1
);
insert into public.programs (slug, name, age, summary, offer, why, benefits, featured, sort_order) values (
  'special-education', '{"en":"Special Education Program","bn":"বিশেষ শিক্ষা প্রোগ্রাম"}'::jsonb, '{"en":"Personalized IEPs","bn":"ব্যক্তিগত আইইপি"}'::jsonb, '{"en":"Individualized Education Plans based on each child’s unique needs.","bn":"প্রতিটি শিশুর অনন্য চাহিদার উপর ভিত্তি করে ব্যক্তিগত শিক্ষা পরিকল্পনা।"}'::jsonb,
  '{"en":"Adaptive curriculum, small groups, therapy coordination, and monthly parent meetings.","bn":"অভিযোজিত পাঠ্যক্রম, ছোট গ্রুপ, থেরাপি সমন্বয় ও মাসিক অভিভাবক সভা।"}'::jsonb, '{"en":"Learning works best when academics and therapy share one consistent plan.","bn":"একাডেমিক ও থেরাপি এক ধারাবাহিক পরিকল্পনায় থাকলে শেখা সবচেয়ে ভালো হয়।"}'::jsonb, '[{"en":"IEP clarity","bn":"আইইপি স্বচ্ছতা"},{"en":"Measurable progress","bn":"পরিমাপযোগ্য অগ্রগতি"},{"en":"Mainstream pathway guidance","bn":"মেইনস্ট্রিম পথ নির্দেশনা"}]'::jsonb, true, 2
);
insert into public.programs (slug, name, age, summary, offer, why, benefits, featured, sort_order) values (
  'vocational-life-skills', '{"en":"Vocational & Life Skills","bn":"ভোকেশনাল ও লাইফ স্কিলস"}'::jsonb, '{"en":"Ages 14+","bn":"বয়স ১৪+"}'::jsonb, '{"en":"Practical job preparation to build long-term independence.","bn":"দীর্ঘমেয়াদি স্বাধীনতা গড়তে বাস্তব কর্ম প্রস্তুতি।"}'::jsonb,
  '{"en":"Life skills labs, workplace routines, social practice, and caregiver planning.","bn":"লাইফ স্কিলস ল্যাব, কর্মক্ষেত্র রুটিন, সামাজিক অনুশীলন ও অভিভাবক পরিকল্পনা।"}'::jsonb, '{"en":"Independence grows when daily living and work skills are taught together.","bn":"দৈনন্দিন জীবন ও কাজের দক্ষতা একসাথে শেখালে স্বাধীনতা বাড়ে।"}'::jsonb, '[{"en":"Daily living skills","bn":"দৈনন্দিন জীবন দক্ষতা"},{"en":"Work readiness","bn":"কর্ম প্রস্তুতি"},{"en":"Community confidence","bn":"কমিউনিটি আত্মবিশ্বাস"}]'::jsonb, true, 3
);
insert into public.programs (slug, name, age, summary, offer, why, benefits, featured, sort_order) values (
  'structured-academic-support', '{"en":"Structured Academic Support","bn":"কাঠামোবদ্ধ একাডেমিক সহায়তা"}'::jsonb, '{"en":"All school ages","bn":"সব স্কুল বয়স"}'::jsonb, '{"en":"Focused academic coaching aligned with each child’s IEP goals.","bn":"প্রতিটি শিশুর আইইপি লক্ষ্যের সাথে সামঞ্জস্যপূর্ণ একাডেমিক কোচিং।"}'::jsonb,
  '{"en":"Literacy, numeracy, and study routines with therapy-informed pacing.","bn":"থেরাপি-সচেতন গতিতে সাক্ষরতা, গণিত ও অধ্যয়ন রুটিন।"}'::jsonb, '{"en":"Academic growth sticks when instruction matches attention and communication needs.","bn":"মনোযোগ ও যোগাযোগ চাহিদার সাথে নির্দেশনা মিললে একাডেমিক বৃদ্ধি স্থায়ী হয়।"}'::jsonb, '[{"en":"Literacy gains","bn":"সাক্ষরতা অগ্রগতি"},{"en":"Math confidence","bn":"গণিত আত্মবিশ্বাস"},{"en":"Study habits","bn":"অধ্যয়ন অভ্যাস"}]'::jsonb, false, 4
);

insert into public.specialties (slug, name, summary, sort_order) values (
  'dental-unit', '{"en":"Dental Unit","bn":"ডেন্টাল ইউনিট"}'::jsonb, '{"en":"Comprehensive oral healthcare with modern techniques.","bn":"আধুনিক কৌশলে সমন্বিত মুখ ও দাঁতের সেবা।"}'::jsonb, 0
);
insert into public.specialties (slug, name, summary, sort_order) values (
  'cancer-center', '{"en":"Cancer Center","bn":"ক্যানসার সেন্টার"}'::jsonb, '{"en":"Compassionate oncology care with coordinated specialists.","bn":"সমন্বিত বিশেষজ্ঞসহ সহানুভূতিশীল অনকোলজি সেবা।"}'::jsonb, 1
);
insert into public.specialties (slug, name, summary, sort_order) values (
  'cardiac-surgery', '{"en":"Cardiac Surgery","bn":"কার্ডিয়াক সার্জারি"}'::jsonb, '{"en":"Expert heart surgery backed by advanced critical care.","bn":"উন্নত ক্রিটিক্যাল কেয়ারসহ বিশেষজ্ঞ হৃদয় অস্ত্রোপচার।"}'::jsonb, 2
);
insert into public.specialties (slug, name, summary, sort_order) values (
  'neurosurgery-center', '{"en":"Neurosurgery","bn":"নিউরোসার্জারি"}'::jsonb, '{"en":"Cutting-edge brain and spine surgical care.","bn":"অত্যাধুনিক মস্তিষ্ক ও মেরুদণ্ড অস্ত্রোপচার সেবা।"}'::jsonb, 3
);
insert into public.specialties (slug, name, summary, sort_order) values (
  'limb-center', '{"en":"Limb Center","bn":"লিম্ব সেন্টার"}'::jsonb, '{"en":"Affordable artificial limbs, braces, and pressure garments.","bn":"সাশ্রয়ী কৃত্রিম অঙ্গ, ব্রেস ও প্রেশার গার্মেন্টস।"}'::jsonb, 4
);
insert into public.specialties (slug, name, summary, sort_order) values (
  'transfusion-medicine', '{"en":"Transfusion Medicine","bn":"ট্রান্সফিউশন মেডিসিন"}'::jsonb, '{"en":"Safe blood products for treatment, surgery, and emergencies.","bn":"চিকিৎসা, অস্ত্রোপচার ও জরুরি অবস্থার জন্য নিরাপদ রক্ত পণ্য।"}'::jsonb, 5
);

insert into public.diagnostics (slug, name, summary, sort_order) values (
  'mri', '{"en":"MRI","bn":"এমআরআই"}'::jsonb, '{"en":"Detailed imaging for accurate diagnosis and treatment planning.","bn":"সঠিক নির্ণয় ও চিকিৎসা পরিকল্পনার জন্য বিস্তারিত ইমেজিং।"}'::jsonb, 0
);
insert into public.diagnostics (slug, name, summary, sort_order) values (
  'ct', '{"en":"CT Scan","bn":"সিটি স্ক্যান"}'::jsonb, '{"en":"Fast, precise diagnostic imaging with compassionate care.","bn":"সহানুভূতিশীল সেবায় দ্রুত, নির্ভুল ডায়াগনস্টিক ইমেজিং।"}'::jsonb, 1
);
insert into public.diagnostics (slug, name, summary, sort_order) values (
  'xray', '{"en":"X-Ray","bn":"এক্স-রে"}'::jsonb, '{"en":"Clear radiographic imaging by experienced radiologists.","bn":"অভিজ্ঞ রেডিওলজিস্টদের দ্বারা স্পষ্ট রেডিওগ্রাফিক ইমেজিং।"}'::jsonb, 2
);
insert into public.diagnostics (slug, name, summary, sort_order) values (
  'ultrasound', '{"en":"Ultrasound","bn":"আল্ট্রাসাউন্ড"}'::jsonb, '{"en":"Real-time imaging for confident clinical decisions.","bn":"আত্মবিশ্বাসী ক্লিনিকাল সিদ্ধান্তের জন্য রিয়েল-টাইম ইমেজিং।"}'::jsonb, 3
);
insert into public.diagnostics (slug, name, summary, sort_order) values (
  'mammography', '{"en":"Mammography","bn":"ম্যামোগ্রাফি"}'::jsonb, '{"en":"Breast screening that supports early detection.","bn":"প্রাথমিক সনাক্তকরণে সহায়ক স্তন স্ক্রিনিং।"}'::jsonb, 4
);

insert into public.packages (slug, name, summary, includes, sort_order) values (
  'executive-basic', '{"en":"Executive Basic","bn":"এক্সিকিউটিভ বেসিক"}'::jsonb, '{"en":"Core screening for early detection of common health risks.","bn":"সাধারণ স্বাস্থ্য ঝুঁকির প্রাথমিক সনাক্তকরণের মূল স্ক্রিনিং।"}'::jsonb, '[{"en":"Physician consult","bn":"চিকিৎসক পরামর্শ"},{"en":"Blood & urine panel","bn":"রক্ত ও প্রস্রাব প্যানেল"},{"en":"Chest X-ray","bn":"বুকের এক্স-রে"},{"en":"ECG","bn":"ইসিজি"}]'::jsonb, 0
);
insert into public.packages (slug, name, summary, includes, sort_order) values (
  'executive-plus', '{"en":"Executive Plus","bn":"এক্সিকিউটিভ প্লাস"}'::jsonb, '{"en":"Expanded diagnostics for adults seeking thorough annual checks.","bn":"সম্পূর্ণ বার্ষিক চেকআপ চাওয়া প্রাপ্তবয়স্কদের জন্য সম্প্রসারিত ডায়াগনস্টিক্স।"}'::jsonb, '[{"en":"Everything in Basic","bn":"বেসিকের সবকিছু"},{"en":"Ultrasound abdomen","bn":"অ্যাবডোমেন আল্ট্রাসাউন্ড"},{"en":"Lipid & diabetes panel","bn":"লিপিড ও ডায়াবেটিস প্যানেল"},{"en":"Diet counseling","bn":"ডায়েট কাউন্সেলিং"}]'::jsonb, 1
);
insert into public.packages (slug, name, summary, includes, sort_order) values (
  'women-wellness', '{"en":"Women’s Wellness","bn":"নারী ওয়েলনেস"}'::jsonb, '{"en":"Focused screenings for women’s health across life stages.","bn":"জীবনের বিভিন্ন পর্যায়ে নারী স্বাস্থ্যের জন্য কেন্দ্রিত স্ক্রিনিং।"}'::jsonb, '[{"en":"OB-GYN consult","bn":"ওবি-জাইনি পরামর্শ"},{"en":"Mammography / USG as advised","bn":"ম্যামোগ্রাফি / ইউএসজি পরামর্শমতো"},{"en":"Lab panel","bn":"ল্যাব প্যানেল"},{"en":"Bone health review","bn":"হাড়ের স্বাস্থ্য পর্যালোচনা"}]'::jsonb, 2
);

insert into public.faqs (id, category, question, answer, sort_order) values (
  'who', 'general', '{"en":"Who can enroll in the autism school?","bn":"অটিজম স্কুলে কে ভর্তি হতে পারে?"}'::jsonb, '{"en":"Children with autism spectrum disorder or related developmental delays may apply. Placement follows assessment, not age alone.","bn":"অটিজম স্পেকট্রাম ডিসঅর্ডার বা সংশ্লিষ্ট বিকাশজনিত বিলম্বযুক্ত শিশুরা আবেদন করতে পারে। প্লেসমেন্ট শুধু বয়স নয়, মূল্যায়ন অনুসারে হয়।"}'::jsonb, 0
);
insert into public.faqs (id, category, question, answer, sort_order) values (
  'shifts', 'therapy', '{"en":"Do you offer flexible therapy shifts?","bn":"আপনারা কি নমনীয় থেরাপি শিফট দেন?"}'::jsonb, '{"en":"Yes. We offer multiple daily shifts so families can choose a schedule that fits work and school routines.","bn":"হ্যাঁ। পরিবার যাতে কাজ ও স্কুল রুটিনের সাথে মানানসই সময় বেছে নিতে পারে সেজন্য একাধিক দৈনিক শিফট আছে।"}'::jsonb, 1
);
insert into public.faqs (id, category, question, answer, sort_order) values (
  'appointment', 'medical', '{"en":"How do I book a doctor appointment?","bn":"ডাক্তার অ্যাপয়েন্টমেন্ট কীভাবে বুক করব?"}'::jsonb, '{"en":"Use the online appointment form, call our medical hotline, or visit the OPD desk during open hours.","bn":"অনলাইন অ্যাপয়েন্টমেন্ট ফর্ম ব্যবহার করুন, মেডিকেল হটলাইনে কল করুন, বা খোলার সময়ে ওপিডি ডেস্কে আসুন।"}'::jsonb, 2
);
insert into public.faqs (id, category, question, answer, sort_order) values (
  'iep', 'therapy', '{"en":"Do students get an Individualized Education Plan?","bn":"শিক্ষার্থীরা কি ব্যক্তিগত শিক্ষা পরিকল্পনা পায়?"}'::jsonb, '{"en":"Yes. Each enrolled child receives an IEP with therapy goals, academic targets, and monthly family review.","bn":"হ্যাঁ। প্রতিটি ভর্তিকৃত শিশু থেরাপি লক্ষ্য, একাডেমিক টার্গেট ও মাসিক পরিবার পর্যালোচনাসহ আইইপি পায়।"}'::jsonb, 3
);
insert into public.faqs (id, category, question, answer, sort_order) values (
  'safety', 'safety', '{"en":"How do you keep the campus safe?","bn":"ক্যাম্পাস কীভাবে নিরাপদ রাখা হয়?"}'::jsonb, '{"en":"Classrooms are CCTV-monitored, staff are trained, and visitor access is controlled.","bn":"শ্রেণিকক্ষ সিসিটিভি-নিরীক্ষিত, কর্মীরা প্রশিক্ষিত এবং দর্শনার্থী প্রবেশ নিয়ন্ত্রিত।"}'::jsonb, 4
);
insert into public.faqs (id, category, question, answer, sort_order) values (
  'packages', 'medical', '{"en":"What is included in health check-up packages?","bn":"হেলথ চেক-আপ প্যাকেজে কী থাকে?"}'::jsonb, '{"en":"Packages typically include physician consult, lab panels, and selected imaging. See the Packages page for details.","bn":"প্যাকেজে সাধারণত চিকিৎসক পরামর্শ, ল্যাব প্যানেল ও নির্বাচিত ইমেজিং থাকে। বিস্তারিত প্যাকেজ পৃষ্ঠায় দেখুন।"}'::jsonb, 5
);

insert into public.testimonials (id, quote, author, sort_order) values (
  't1', '{"en":"After months of speech therapy and ABA, our son now tells us about his day. The team truly cares.","bn":"কয়েক মাস স্পিচ থেরাপি ও এবিএর পর আমাদের ছেলে এখন তার দিনের কথা বলে। দলটি সত্যিই যত্নশীল।"}'::jsonb, '{"en":"Parent of a 6-year-old","bn":"৬ বছর বয়সী শিশুর অভিভাবক"}'::jsonb, 0
);
insert into public.testimonials (id, quote, author, sort_order) values (
  't2', '{"en":"Booking an appointment was simple, and the cardiology team explained every step clearly.","bn":"অ্যাপয়েন্টমেন্ট বুকিং সহজ ছিল এবং কার্ডিওলজি দল প্রতিটি ধাপ স্পষ্টভাবে ব্যাখ্যা করেছে।"}'::jsonb, '{"en":"Cardiac patient, Sirajganj","bn":"কার্ডিয়াক রোগী, সিরাজগঞ্জ"}'::jsonb, 1
);
insert into public.testimonials (id, quote, author, sort_order) values (
  't3', '{"en":"Therapy and school under one roof means our daughter’s plan finally feels consistent.","bn":"এক ছাদের নিচে থেরাপি ও স্কুল মানে আমাদের মেয়ের পরিকল্পনা অবশেষে ধারাবাহিক মনে হয়।"}'::jsonb, '{"en":"Parent, student since 2024","bn":"অভিভাবক, ২০২৪ থেকে শিক্ষার্থী"}'::jsonb, 2
);

insert into public.gallery_items (id, title, kind, sort_order) values (
  'g1', '{"en":"Hospital campus","bn":"হাসপাতাল ক্যাম্পাস"}'::jsonb, 'photo', 0
);
insert into public.gallery_items (id, title, kind, sort_order) values (
  'g2', '{"en":"Therapy classroom","bn":"থেরাপি শ্রেণিকক্ষ"}'::jsonb, 'photo', 1
);
insert into public.gallery_items (id, title, kind, sort_order) values (
  'g3', '{"en":"Diagnostic suite","bn":"ডায়াগনস্টিক স্যুট"}'::jsonb, 'photo', 2
);
insert into public.gallery_items (id, title, kind, sort_order) values (
  'g4', '{"en":"Outdoor activities","bn":"বহিরঙ্গন কার্যক্রম"}'::jsonb, 'photo', 3
);
insert into public.gallery_items (id, title, kind, sort_order) values (
  'g5', '{"en":"Parent orientation","bn":"অভিভাবক ওরিয়েন্টেশন"}'::jsonb, 'video', 4
);
insert into public.gallery_items (id, title, kind, sort_order) values (
  'g6', '{"en":"Community day","bn":"কমিউনিটি ডে"}'::jsonb, 'photo', 5
);

insert into public.stats (id, value, suffix, label, sort_order) values (
  'doctors', 120, '+', '{"en":"Doctors & specialists","bn":"ডাক্তার ও বিশেষজ্ঞ"}'::jsonb, 0
);
insert into public.stats (id, value, suffix, label, sort_order) values (
  'departments', 28, '+', '{"en":"Departments","bn":"বিভাগ"}'::jsonb, 1
);
insert into public.stats (id, value, suffix, label, sort_order) values (
  'children', 1000, '+', '{"en":"Children supported","bn":"সহায়তাপ্রাপ্ত শিশু"}'::jsonb, 2
);
insert into public.stats (id, value, suffix, label, sort_order) values (
  'therapists', 70, '+', '{"en":"Therapists","bn":"থেরাপিস্ট"}'::jsonb, 3
);

-- Done. Verify: select count(*) from doctors;