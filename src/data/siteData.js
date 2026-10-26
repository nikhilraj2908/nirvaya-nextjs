import en from '@/locales/en.json';

export const CLINIC_INFO = {
  name: en.clinic.name,
  legalEntity: en.clinic.legalEntity,
  tagline: en.clinic.tagline,
  shortDescription: en.clinic.shortDescription,
  medicalDirector: en.clinic.medicalDirector,
  qualifications: en.clinic.qualifications,
  publicationsCount: 18,

  // Contact details (Configurable placeholders)
  phone: "+91 755 492 8200",
  phoneRaw: "+917554928200",
  phoneEmergency: "+91 94250 18200",
  whatsapp: "+91 94250 18200",
  whatsappRaw: "919425018200",
  whatsappDefaultMessage: "Hello Nirvaya Eyecare Centre, I would like to enquire about an eye consultation.",
  email: "info@nirvayaeyecare.com",
  medicalDirectorEmail: "medical.director@nirvayaeyecare.com",

  // Location
  addressLine1: en.clinic.addressLine1,
  addressLine2: en.clinic.addressLine2,
  city: en.clinic.city,
  state: en.clinic.state,
  pincode: en.clinic.pincode,
  landmark: en.clinic.landmark,
  fullAddress: en.clinic.fullAddress,

  // Timings
  timings: en.clinic.timings,

  social: {
    instagram: "https://instagram.com/nirvayaeyecare",
    linkedin: "https://linkedin.com/company/nirvaya-eyecare",
    googleBusiness: "https://maps.google.com/?q=Nirvaya+Eyecare+Centre+Bhopal"
  }
};

export const NAVIGATION_ITEMS = [
  { label: en.nav.home, href: "/" },
  { label: en.nav.about, href: "/about" },
  { label: en.nav.doctors, href: "/doctors" },
  {
    label: en.nav.services,
    href: "/services",
    isDropdown: true,
    children: [
      { label: "Retina & Vitreoretinal Surgery", href: "/services#services-retina", desc: "Advanced vitrectomy for detachment, macular holes & trauma" },
      { label: "Intravitreal Injections (Anti-VEGF)", href: "/services#services-injections", desc: "Targeted therapy for AMD, DME & retinal vein occlusions" },
      { label: "Diabetic Eye Care", href: "/services#services-diabetic", desc: "Systematic screening, laser photocoagulation & maculopathy management" },
      { label: "ROP Screening & Treatment", href: "/services#services-rop", desc: "Bedside laser & anti-VEGF for preterm neonatal retinopathy" },
      { label: "Cataract Surgery (Phaco)", href: "/services#services-cataract", desc: "Blade-free micro-incision phaco with premium toric & multifocal IOLs" },
      { label: "Uveitis & Ocular Immunology", href: "/services#services-uveitis", desc: "Precise diagnostic workup and immunosuppressive management" },
      { label: "Comprehensive Eye Check-up", href: "/services#services-comprehensive", desc: "Complete dilated anterior & posterior segment evaluations" },
      { label: "Optical & Visual Diagnostics", href: "/services#services-optical", desc: "Precision prescription and high-resolution ophthalmic imaging" }
    ]
  },
  {
    label: en.nav.knowledgeHub,
    href: "/blog",
    isDropdown: true,
    children: [
      { label: "Articles & Patient Guides", href: "/blog", desc: "Evidence-based eye health guides & retina care blogs" },
      { label: "Research Publications", href: "/research", desc: "18+ Peer-reviewed clinical papers by Dr Sandhya Gaur" }
    ]
  },
  { label: en.nav.technology, href: "/technology" },
  { label: en.nav.contact, href: "/contact" }
];

const STAGE_PROGRESS_RANGES = [
  [0, 0.15],
  [0.15, 0.29],
  [0.29, 0.43],
  [0.43, 0.57],
  [0.57, 0.71],
  [0.71, 0.85],
  [0.85, 1.0]
];

export const HERO_STAGES = en.heroStages.map((stageItem, idx) => ({
  ...stageItem,
  progressRange: STAGE_PROGRESS_RANGES[idx] || [0, 1]
}));

export const SPECIALTIES = [
  {
    id: "services-vitreoretinal",
    title: "Vitreoretinal Surgery (Vitrectomy)",
    category: "Surgical Retina",
    badge: "Core Surgical Specialty",
    image: "/images/specialties/retina-vitre.jpg",
    shortDescription: "Sutureless vitrectomy for retinal detachment, macular hole, epiretinal membrane, vitreous haemorrhage and dislocated lens — fellowship-trained surgical retina care in Bhopal.",
    symptoms: ["Sudden flashes or shower of floaters", "Curtain falling over visual field", "Distorted or wavy central vision"],
    badgeColor: "gold"
  },
  {
    "id": "services-lasers",
    title: "Retinal Laser Procedures",
    category: "Medical Retina",
    badge: "Outpatient Laser",
    image: "/images/specialties/diabetic-eyecare.jpg",
    shortDescription: "Laser photocoagulation for diabetic retinopathy, retinal tears, and retinal vein occlusion; barrage laser for lattice degeneration.",
    symptoms: ["Peripheral retinal thinning (lattice)", "Retinal tears with light flashes", "Proliferative diabetic retinopathy"],
    badgeColor: "navy"
  },
  {
    id: "services-injections",
    title: "Intravitreal Injections",
    category: "Medical Retina",
    badge: "Targeted Pharmacotherapy",
    image: "/images/specialties/anti-vegf.jpg",
    shortDescription: "Anti-VEGF and steroid injections for wet AMD, diabetic macular oedema and vein occlusion, delivered under strict aseptic protocol.",
    symptoms: ["Blurry central reading vision", "Dark spot in center of vision", "Sudden painless drop in vision in one eye"],
    badgeColor: "blue"
  },
  {
    id: "services-rop",
    title: "ROP Screening & Treatment",
    category: "Pediatric Retina",
    badge: "Neonatal Care",
    image: "/images/specialties/rop-screening.jpg",
    shortDescription: "Retinopathy of Prematurity screening for premature babies with timely laser and injection treatment — a critical, time-sensitive service for newborns.",
    symptoms: ["Infants born <34 weeks or <1750g", "Requirement of prolonged oxygen support", "Pediatrician / Neonatologist referral"],
    badgeColor: "gold"
  },
  {
    id: "services-uveitis",
    title: "Uveitis Care",
    category: "Ocular Immunology",
    badge: "Complex Diagnostics",
    shortDescription: "Diagnosis and management of uveitis and inflammatory eye disease in adults and children, including immune-mediated and infective causes.",
    symptoms: ["Painful red eye with light sensitivity", "Floaters with dull ache", "Recurrent episodes of eye redness"],
    badgeColor: "navy"
  },
  {
    id: "services-cataract",
    title: "Cataract Surgery (Phaco & SICS)",
    category: "Anterior Segment",
    badge: "Micro-Incision",
    shortDescription: "Phacoemulsification and small-incision cataract surgery (SICS) with premium IOL options and research-backed IOL power planning.",
    symptoms: ["Cloudy or foggy eyesight", "Glare and halos around lights at night", "Faded or yellowish colour perception"],
    badgeColor: "blue"
  },
  {
    id: "services-comprehensive",
    title: "Comprehensive Ophthalmology",
    category: "Diagnostic & Preventive",
    badge: "General Ophthalmology",
    shortDescription: "Complete eye evaluation with dilated retinal examination and modern imaging — for routine check-ups, referrals and second opinions.",
    symptoms: ["Routine annual screening", "Eyestrain, headache from screen work", "Family history of glaucoma or retina issues"],
    badgeColor: "blue"
  }
];

export const CONDITIONS_TREATED = [
  { name: "Diabetic Retinopathy", blurb: "Diabetes can silently damage the retina. Regular retina check-ups, lasers and injections protect vision — essential for every diabetic." },
  { name: "Age-related Macular Degeneration (AMD)", blurb: "A leading cause of central vision loss after 50. Wet AMD is treatable with anti-VEGF intravitreal injections when caught early." },
  { name: "Retinal Detachment & Retinal Tears", blurb: "Sudden floaters, flashes or a curtain over vision is an emergency. Timely laser or vitrectomy surgery can save sight." },
  { name: "Macular Hole", blurb: "A small gap in the central retina causing distorted reading vision — repaired with modern vitrectomy and ILM-flap techniques." },
  { name: "Retinopathy of Prematurity (ROP)", blurb: "Premature and low-birth-weight babies need retina screening in the first weeks of life. Timely treatment prevents lifelong blindness." },
  { name: "Uveitis (Eye Inflammation)", blurb: "Redness, pain and light sensitivity from inflammation inside the eye — needs specialist work-up to find and treat the cause." },
  { name: "Cataract", blurb: "Clouding of the natural lens causing blur and glare — restored with quick, safe phacoemulsification surgery and lens implants." },
  { name: "Retinal Vein Occlusion", blurb: "A 'stroke' of the eye's veins causing sudden blurred vision — managed with injections and laser to control swelling." },
  { name: "Vitreous Haemorrhage", blurb: "Bleeding inside the eye from diabetes, trauma or retinal tears — evaluated urgently and cleared surgically when needed." },
  { name: "Epiretinal Membrane", blurb: "A fine scar tissue film over the macula causing distortion — peeled surgically to improve vision quality." }
];

export const DOCTOR_PROFILE = {
  name: "Dr Sandhya Gaur",
  designation: "Medical Director & Chief Vitreoretinal Surgeon",
  degrees: "MD Ophthalmology (AIIMS, New Delhi) · DNB · FVRS (Vitreoretina & Uvea) · FAICO (Retina & Vitreous) – Gold Medalist",
  qualifications: [
    { title: "MD (Ophthalmology)", institution: "All India Institute of Medical Sciences (AIIMS), New Delhi", note: "Dr. R.P. Centre for Ophthalmic Sciences" },
    { title: "DNB (Ophthalmology)", institution: "National Board of Examinations (NBE)", note: "New Delhi" },
    { title: "Fellowship in Vitreoretina & Uvea (FVRS)", institution: "Sadguru Netra Chikitsalaya, Chitrakoot", note: "2-Year Long-Term Surgical Fellowship" },
    { title: "FAICO (Retina & Vitreous)", institution: "All India Ophthalmological Society (AIOS)", note: "Gold Medalist" }
  ],
  awards: [
    "FAICO (Retina & Vitreous) — Gold Medalist (All India Ophthalmological Society)",
    "Associate Editor — Haryana Journal of Ophthalmology",
    "Author of 18+ Peer-Reviewed Publications in Indexed National and International Journals",
    "Life Member — All India Ophthalmological Society (AIOS)",
    "Life Member — Vitreo Retina Society of India (VRSI)",
    "Member — European Society of Retina Specialists (EURETINA)",
    "Life Member — Young Ophthalmologists Society of India (YOSI)",
    "Life Member — Delhi Ophthalmological Society (DOS)",
    "Life Member — Haryana Ophthalmological Society (HOS)"
  ],
  expertiseAreas: [
    "Vitreoretinal Surgery (Vitrectomy 25G/27G)",
    "Retinal Laser Procedures & Barrage Laser",
    "Intravitreal Injections (Anti-VEGF & Steroids)",
    "Retinopathy of Prematurity (ROP) Screening & Laser",
    "Uveitis & Ocular Inflammation",
    "Cataract Surgery (Phacoemulsification & SICS)",
    "Comprehensive Ophthalmology & Retinal Diagnostics"
  ],
  languages: ["Hindi", "English"],
  opdDays: "Monday to Saturday: 9:30 AM – 7:30 PM",
  philosophy: "Eye care demands patient-focused honesty, delicate surgical precision, and unhurried clinical listening. Our aim at Nirvaya is to provide ethical, transparent, world-class retina and cataract care directly to families in central India.",
  social: {
    googleScholar: "https://scholar.google.com/citations?hl=en&user=_4PoQfIAAAAJ",
    linkedin: "https://www.linkedin.com/in/dr-sandhya-gaur-593802206",
    instagram: "https://www.instagram.com/surgeon_in_heels/",
    googleReviews: "https://share.google/VmrWZpduI5fiBXcYK"
  }
};

export const TECHNOLOGY_FACILITIES = [
  {
    title: "High-Definition Spectral OCT & Angiography",
    category: "Retina Diagnostics",
    description: "Non-invasive, micrometer-resolution cross-sectional imaging of retinal layers and choriocapillaris for earliest detection of macular degenerations and diabetic changes.",
    features: ["Sub-micron axial resolution", "Autofluorescence & EDI-OCT", "Vessel-density microvascular mapping"]
  },
  {
    title: "Advanced 25G / 27G Micro-Incision Vitrectomy System",
    category: "Surgical Suite",
    description: "High-speed dual-pneumatic vitrectomy cutter with active intraocular pressure control, ensuring maximum retinal stability during complex vitreoretinal procedures.",
    features: ["Up to 10,000 cuts/minute", "Sutureless self-sealing ports", "Integrated chandelier illumination"]
  },
  {
    title: "Cold Phacoemulsification System with Active Fluidics",
    category: "Cataract Suite",
    description: "Micro-coaxial cataract removal maintaining physiological eye chamber pressure, enabling minimal energy delivery and crystal-clear post-operative day one corneas.",
    features: ["Torsional ultrasound energy", "Real-time IOP stabilization", "Customized torsional surge suppression"]
  },
  {
    title: "Green Laser Photocoagulator with Slit-Lamp & LIO Delivery",
    category: "Retina Laser",
    description: "Precision 532nm diode-pumped green laser for pan-retinal photocoagulation, retinal tear barrier treatment, and pediatric bedside ROP laser delivery.",
    features: ["Uniform spot laser profile", "Short pulse duration options", "Minimal collateral tissue heating"]
  },
  {
    title: "Modular Positive-Pressure HEPA Clean Air OT",
    category: "Infection Control",
    description: "Dedicated ophthalmic surgical theatre engineered with Class 100 laminar airflow and continuous air exchanges to maintain zero-compromise surgical asepsis.",
    features: ["HEPA-filtered laminar airflow", "Seamless anti-microbial surfaces", "Strict protocol sterilization monitoring"]
  },
  {
    title: "Comfort Day-Care Recovery Suites",
    category: "Patient Comfort",
    description: "Quiet, dignified recovery spaces designed specifically for same-day cataract and vitreo-retina discharge, allowing patients to rest comfortably before returning home.",
    features: ["Individual monitored recliners", "Dedicated post-op medication counselling", "Family companion seating"]
  }
];

export { DOCTOR_REVIEWS } from './doctorReviews';

export const PATIENT_ARTICLES = [
  {
    id: "diabetic-retinopathy-guide",
    category: "Diabetic Eye Care",
    readTime: "4 min read",
    date: "Patient Education",
    title: "Why People with Diabetes Need Annual Dilated Retina Examinations",
    excerpt: "Diabetic retinopathy often produces zero symptoms in its earliest treatable stages. Learn how early OCT screening and timely intervention prevent irreversible vision impairment.",
    actionText: "Read Article"
  },
  {
    id: "modern-cataract-iol-choices",
    category: "Cataract",
    readTime: "5 min read",
    date: "Patient Guide",
    title: "Understanding Monofocal vs Toric vs Multifocal IOLs for Cataract Surgery",
    excerpt: "Choosing the correct intraocular lens depends on your lifestyle, night driving habits, and corneal astigmatism. Here is an honest, clinical breakdown of lens technologies.",
    actionText: "Read Article"
  },
  {
    id: "what-is-rop-screening",
    category: "Pediatric Retina",
    readTime: "4 min read",
    date: "Infant Health",
    title: "What Every Parent of a Preterm Baby Must Know About ROP",
    excerpt: "Retinopathy of Prematurity is a critical developmental condition. The 'Golden Month' window for screening premature infants can preserve a child's sight for life.",
    actionText: "Read Article"
  }
];

export const FAQ_ITEMS = [
  {
    question: "Do I need an appointment before visiting Nirvaya Eyecare Centre?",
    answer: "Prior slot pre-booking is recommended to minimize waiting times and ensure Dr Sandhya Gaur can give you dedicated, unhurried time. However, sudden emergencies (like sudden loss of vision, eye trauma, or acute retinal tears) are attended to promptly."
  },
  {
    question: "How long does a comprehensive dilated retina evaluation take?",
    answer: "A complete retina checkup requires pupil dilation using specialized eye drops, which takes approximately 30 to 45 minutes to achieve adequate dilation. The examination, retinal imaging and counselling take another 20 to 30 minutes. We advise having a companion to drive you home as vision remains blurred for 2–4 hours after dilation."
  },
  {
    question: "Is cataract surgery performed on a day-care basis?",
    answer: "Yes. Modern micro-incision phacoemulsification takes only 10 to 15 minutes in the operating room. You will arrive 1 hour prior to surgery for preparation and can comfortably return home within 1 to 2 hours post-procedure."
  },
  {
    question: "What is an Intravitreal Injection and is it painful?",
    answer: "Intravitreal injections deliver targeted anti-VEGF medication directly into the vitreous gel for conditions like macular degeneration or diabetic edema. The eye is thoroughly numbed with topical anesthetic drops; patients feel slight mild pressure, but the procedure is quick and virtually painless."
  },
  {
    question: "What documents should I bring for my first consultation?",
    answer: "Please bring all previous eye prescription glasses, prior ophthalmology reports, medical history summaries (particularly diabetes, hypertension, blood thinners), and any recent retinal scans if available."
  }
];
