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
  [0, 0.18],
  [0.18, 0.35],
  [0.35, 0.52],
  [0.52, 0.68],
  [0.68, 0.84],
  [0.84, 1.0]
];

export const HERO_STAGES = en.heroStages.map((stageItem, idx) => ({
  ...stageItem,
  progressRange: STAGE_PROGRESS_RANGES[idx] || [0, 1]
}));

export const SPECIALTIES = [
  {
    id: "services-retina",
    title: "Retina & Vitreoretinal Surgery",
    category: "Surgical Retina",
    badge: "Core Specialty",
    image: "/images/specialties/retina-vitre.jpg",
    shortDescription: "Specialist management of retinal detachments, macular holes, vitreous hemorrhage and epiretinal membranes using sutureless micro-incision vitrectomy.",
    symptoms: ["Sudden flashes or shower of floaters", "Curtain falling over visual field", "Distorted or wavy central vision"],
    badgeColor: "gold"
  },
  {
    id: "services-injections",
    title: "Intravitreal Injections (Anti-VEGF)",
    category: "Medical Retina",
    badge: "Outpatient Day-Care",
    image: "/images/specialties/anti-vegf.jpg",
    shortDescription: "Painless, precise intravitreal injections for Age-related Macular Degeneration (AMD), Diabetic Macular Edema, and Retinal Vein Occlusion (RVO).",
    symptoms: ["Blurry central reading vision", "Dark spot in center of vision", "Sudden painless drop in vision in one eye"],
    badgeColor: "blue"
  },
  {
    id: "services-diabetic",
    title: "Diabetic Eye Care & Retinopathy",
    category: "Systemic Retina",
    badge: "Preventive & Laser",
    image: "/images/specialties/diabetic-eyecare.jpg",
    shortDescription: "Comprehensive screening, high-definition fundus photography, green laser photocoagulation and anti-VEGF protocols to safeguard vision against diabetes.",
    symptoms: ["Fluctuating vision with blood sugar", "Spots or dark strings (floaters)", "Empty or dark areas in field"],
    badgeColor: "navy"
  },
  {
    id: "services-rop",
    title: "ROP Screening & Treatment",
    category: "Pediatric Retina",
    badge: "Neonatal Care",
    image: "/images/specialties/rop-screening.jpg",
    shortDescription: "Timely bedside screening for premature and low-birth-weight neonates to detect and treat Retinopathy of Prematurity before irreversible vision loss.",
    symptoms: ["Infants born <34 weeks or <1750g", "Requirement of prolonged oxygen support", "Pediatrician / Neonatologist referral"],
    badgeColor: "gold"
  },
  {
    id: "services-cataract",
    title: "Cataract Surgery (Phaco)",
    category: "Anterior Segment",
    badge: "Micro-Incision",
    shortDescription: "Stitchless, injection-free phacoemulsification with bespoke intraocular lenses (Toric, Extended Depth of Focus, Multifocal) for clear visual freedom.",
    symptoms: ["Cloudy or foggy eyesight", "Glare and halos around lights at night", "Faded or yellowish colour perception"],
    badgeColor: "blue"
  },
  {
    id: "services-uveitis",
    title: "Uveitis & Ocular Immunology",
    category: "Medical Retina",
    badge: "Complex Diagnostics",
    shortDescription: "Meticulous clinical evaluation, systemic workups and targeted immunotherapy for anterior, intermediate, and posterior uveitis and vasculitis.",
    symptoms: ["Painful red eye with light sensitivity", "Floaters with dull ache", "Recurrent episodes of eye redness"],
    badgeColor: "navy"
  },
  {
    id: "services-comprehensive",
    title: "Comprehensive Eye Check-up",
    category: "Preventive Care",
    badge: "General Ophthalmology",
    shortDescription: "Detailed slit-lamp examination, applanation tonometry (eye pressure), dilated indirect ophthalmoscopy, and computerized refraction.",
    symptoms: ["Routine annual screening", "Eyestrain, headache from screen work", "Family history of glaucoma or retina issues"],
    badgeColor: "blue"
  },
  {
    id: "services-optical",
    title: "Optical & Visual Diagnostics",
    category: "Clinical Support",
    badge: "Precision Optics",
    shortDescription: "Precision ophthalmic lens dispensing, corrective prism assessments, and high-definition anterior-posterior optical coherence tomography.",
    symptoms: ["Difficulty with reading small print", "Requirement of progressive lenses", "Post-operative optical fine-tuning"],
    badgeColor: "navy"
  }
];

export const DOCTOR_PROFILE = {
  name: "Dr Sandhya Gaur",
  designation: "Medical Director & Senior Vitreo-Retina & Cataract Specialist",
  qualifications: [
    { title: "MD (Ophthalmology)", institution: "AIIMS, New Delhi", note: "Apex National Institute" },
    { title: "DNB (Ophthalmology)", institution: "National Board of Examinations", note: "New Delhi" },
    { title: "Fellowship in Vitreo-Retinal Surgery (FVRS)", institution: "Premier Tertiary Eye Institute", note: "Advanced Surgical Training" },
    { title: "FAICO (Retina)", institution: "All India Ophthalmological Society", note: "Gold Medalist" }
  ],
  awards: [
    "FAICO (Retina) Gold Medalist – Highest National Honours in Vitreo-Retinal Examination",
    "Over 18 peer-reviewed research papers published in indexed national & international ophthalmic journals",
    "Keynote speaker & instructor at National Vitreo-Retina & Cataract conferences"
  ],
  expertiseAreas: [
    "Micro-Incision Vitrectomy Surgery (MIVS 25G/27G)",
    "Surgical Repair of Retinal Detachment & Macular Holes",
    "Diabetic Vitrectomy, Laser Photocoagulation & Macular Edema",
    "Retinopathy of Prematurity (ROP) Screening & Laser",
    "Micro-Incision Cataract Surgery (Phaco) with Premium IOLs",
    "Complex Secondary IOL Fixation (Scleral-Fixated IOL)",
    "Uveitis and Ocular Inflammatory Diseases"
  ],
  languages: ["Hindi", "English"],
  opdDays: "Monday to Saturday (By Prior Appointment / Slot Pre-booking)",
  philosophy: "Eye care demands patient-focused honesty, delicate surgical precision, and unhurried clinical listening. Our aim at Nirvaya is to provide ethical, transparent, world-class retina and cataract care directly to families in central India."
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
