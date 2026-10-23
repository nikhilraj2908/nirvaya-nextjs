export const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'appointments', label: 'Appointments & Visits' },
  { id: 'retina', label: 'Retina & Vitrectomy' },
  { id: 'cataract', label: 'Cataract Surgery' },
  { id: 'injections', label: 'Anti-VEGF Injections' },
  { id: 'insurance', label: 'Insurance & Checklist' }
];

export const ALL_FAQS = [
  {
    id: 'appointment',
    category: 'appointments',
    categoryLabel: 'Appointment Policy',
    question: {
      en: 'Do I need an appointment before visiting Nirvaya Eyecare Centre?',
      hi: 'क्या निर्वाया आईकेयर सेंटर में आने से पहले अपॉइंटमेंट लेना जरूरी है?'
    },
    answer: {
      en: 'Prior slot pre-booking is strongly recommended to minimize waiting times and ensure Dr. Sandhya Gaur can give you dedicated, unhurried clinical time. However, sudden ocular emergencies (such as sudden loss of vision, acute eye trauma, severe sudden pain, or fresh retinal detachment symptoms) are attended to promptly with priority emergency triage.',
      hi: 'अनावश्यक प्रतीक्षा समय से बचने तथा विस्तृत जांच एवं परामर्श हेतु पहले से स्लॉट बुक करना अत्यधिक उचित है। तथापि, दृष्टि में अचानक गिरावट या किसी भी नेत्र आघात (इमरजेंसी) पर तुरंत प्राथमिकता के साथ देखा जाता है।'
    },
    keyTakeaway: 'Dedicated 20-30 min unhurried consultation; walk-in priority for acute emergencies.',
    ctaText: 'Pre-Book Appointment',
    ctaLink: '/pre-book'
  },
  {
    id: 'retina-checkup',
    category: 'retina',
    categoryLabel: 'Retina Diagnostics',
    question: {
      en: 'How long does a comprehensive dilated retina evaluation take?',
      hi: 'विस्तृत डायलेटेड रेटिना जांच में कुल कितना समय लगता है?'
    },
    answer: {
      en: 'A comprehensive retinal evaluation requires pupil dilation using specialized eye drops, taking approximately 30 to 45 minutes to achieve maximum dilation. Subsequent High-Definition Spectral OCT micrometer scanning, indirect ophthalmoscopy, and doctor counselling take an additional 20 to 30 minutes. Vision remains temporarily blurred for 2 to 4 hours post-dilation, so we strongly advise bringing a companion to drive you home.',
      hi: 'रेटिना की सूक्ष्म जांच के लिए पुतली फैलाना जरूरी होता है, जिसमें दवा डालने के बाद 30 से 45 मिनट का समय लगता है। इसके उपरांत ओसीटी व विशेषज्ञ परामर्श में 20 से 30 मिनट लगते हैं। जांच के बाद कुछ समय दृष्टि धुंधली रह सकती है, अतः किसी सहयोगी के साथ आना उचित है।'
    },
    keyTakeaway: 'Total clinic visit takes 60–75 minutes. Bring sunglasses and an accompanying family member.',
    ctaText: 'Explore Retina Tech',
    ctaLink: '/technology'
  },
  {
    id: 'cataract-daycare',
    category: 'cataract',
    categoryLabel: 'Cataract Day-Care',
    question: {
      en: 'Is cataract surgery performed on a same-day (day-care) basis?',
      hi: 'क्या मोतियाबिंद सर्जरी उसी दिन घर लौटने के आधार पर की जाती है?'
    },
    answer: {
      en: 'Yes! Modern micro-incision phacoemulsification cataract surgery takes only 10 to 15 minutes in our HEPA-filtered Modular OT. You arrive 1 hour prior to surgery for preparation and painless topical numbing (no injections around the eye). You rest comfortably in our day-care recovery suite and return home within 1 to 2 hours post-procedure with crystal-clear vision and no hospital overnight stay.',
      hi: 'जी हाँ! आधुनिक माइक्रो-चीरा फेको सर्जरी में केवल 10 से 15 मिनट का समय लगता है। बिना किसी इंजेक्शन के केवल ड्रॉप्स डालकर आंख सुन्न की जाती है। सर्जरी के 1-2 घंटे बाद मरीज आराम से घर जा सकते हैं तथा अस्पताल में भर्ती रहने की कोई आवश्यकता नहीं होती।'
    },
    keyTakeaway: '10–15 minute stitchless phaco surgery with zero injection pain; same-day home discharge within 2 hours.',
    ctaText: 'View Cataract Care',
    ctaLink: '/services'
  },
  {
    id: 'eye-injections',
    category: 'injections',
    categoryLabel: 'Retina Injections',
    question: {
      en: 'What is an Intravitreal Injection and is the procedure painful?',
      hi: 'इंट्राविट्रियल (Anti-VEGF) इंजेक्शन क्या है और क्या यह दर्दनाक होता है?'
    },
    answer: {
      en: 'Intravitreal injections deliver targeted anti-VEGF medication directly into the vitreous to treat diabetic macular edema, retinal vein occlusion, and age-related macular degeneration (AMD). Before the procedure, the eye surface is thoroughly numbed using specialized topical anesthetic drops. Patients feel only a momentary, mild sensation of gentle pressure, but no sharp needle pain. The entire injection takes less than 2 minutes in our sterile OT.',
      hi: 'इंट्राविट्रियल इंजेक्शन रेटिना की सूजन और असामान्य रक्त वाहिकाओं के उपचार के लिए दिया जाता है। प्रक्रिया से पूर्व आंख में एनेस्थेटिक ड्रॉप्स डालकर सुन्न किया जाता है, जिससे सुई का कोई दर्द नहीं होता। केवल हल्का सा दबाव महसूस हो सकता है। यह प्रक्रिया ओटी में 2 मिनट से भी कम समय में पूरी हो जाती है।'
    },
    keyTakeaway: 'Topical numbing drops eliminate needle pain; completed in under 2 minutes in sterile surgical conditions.',
    ctaText: 'Consult Specialist',
    ctaLink: '/pre-book'
  },
  {
    id: 'documents-checklist',
    category: 'insurance',
    categoryLabel: 'Patient Checklist',
    question: {
      en: 'What clinical documents and medical records should I bring?',
      hi: 'आंखों के परामर्श के लिए आते समय कौन से दस्तावेज व पुराने रिकॉर्ड साथ लाएं?'
    },
    answer: {
      en: 'Please bring all previous eye prescription glasses, prior ophthalmology case files, and any past retinal scans (OCT, FFA, B-Scan ultrasound) if available. Also bring medical summaries of systemic conditions—particularly diabetes blood sugar records (HbA1c), blood pressure readings, and any ongoing medications (such as blood thinners or cardiac drugs). This helps Dr. Gaur safely tailor your personalized clinical plan.',
      hi: 'कृपया अपने पुराने चश्मे, पिछली जांच पर्चियां, पहले हुए नेत्र परीक्षण या लेजर के कागजात अवश्य लाएं। यदि आप मधुमेह (डायबिटीज) या उच्च रक्तचाप के मरीज हैं, तो हालिया ब्लड शुगर (HbA1c) रिपोर्ट व चल रही दवाओं की सूची अवश्य साथ रखें।'
    },
    keyTakeaway: 'Bring old glasses, previous scan reports, recent HbA1c/blood sugar log, and active medication list.',
    ctaText: 'Clinic Location & Info',
    ctaLink: '/contact'
  },
  {
    id: 'vitrectomy-recovery',
    category: 'retina',
    categoryLabel: 'Vitreo-Retina',
    question: {
      en: 'What is recovery like after 25G / 27G sutureless vitrectomy surgery?',
      hi: '25G / 27G विट्रेक्टोमी सर्जरी के बाद ठीक होने में कितना समय लगता है?'
    },
    answer: {
      en: 'Micro-incisional 25-gauge and 27-gauge sutureless vitrectomy uses self-sealing micro-cannulas that heal without surface stitches. If a gas bubble or silicone oil tamponade is placed inside the eye (common for retinal detachment or macular hole repair), you may be advised to maintain a specific prone (face-down) posture for 3 to 7 days. Most patients resume gentle routine desk activities within 1 to 2 weeks while vision steadily improves over weeks to months.',
      hi: '25G और 27G विट्रेक्टोमी में टांकों की आवश्यकता नहीं होती। यदि आंख में गैस या सिलिकॉन ऑयल डाला गया है, तो कुछ दिन सिर झुकाकर (प्रोन पोजिशन) रखने की सलाह दी जा सकती है। अधिकांश मरीज 1 से 2 सप्ताह में सामान्य दैनिक कार्य शुरू कर सकते हैं।'
    },
    keyTakeaway: 'Sutureless self-sealing micro-incisions; posture guidance provided when gas or oil tamponade is used.',
    ctaText: 'Learn Vitrectomy Details',
    ctaLink: '/services'
  },
  {
    id: 'diabetic-retinopathy-screening',
    category: 'retina',
    categoryLabel: 'Diabetic Eye Care',
    question: {
      en: 'How frequently should a diabetic patient get their retina screened?',
      hi: 'डायबिटीज के मरीजों को कितनी बार अपने पर्दे (रेटिना) की जांच करानी चाहिए?'
    },
    answer: {
      en: 'Every individual with Type 2 diabetes should undergo a comprehensive dilated retinal evaluation at least once a year, even if vision seems 100% normal. Diabetic retinopathy often develops silently with microscopic bleeding and swelling before any blurring is noticed. If early retinopathy or macular edema is detected, Dr. Gaur will recommend monitoring every 3 to 6 months or initiating timely retinal laser or anti-VEGF therapy to prevent permanent vision loss.',
      hi: 'टाइप 2 डायबिटीज के प्रत्येक मरीज को वर्ष में कम से कम एक बार विस्तृत डायलेटेड रेटिना जांच करानी चाहिए, भले ही आंखों में कोई परेशानी महसूस न हो रही हो। शुरुआती रेटिनोपैथी का पता समय पर लगने से दृष्टि की स्थायी क्षति को रोका जा सकता है।'
    },
    keyTakeaway: 'Annual mandatory screening for all diabetics; 3-6 month follow-ups if early diabetic changes are found.',
    ctaText: 'Book Diabetic Retina Scan',
    ctaLink: '/pre-book'
  },
  {
    id: 'rop-screening-timeline',
    category: 'retina',
    categoryLabel: 'Neonatal ROP',
    question: {
      en: 'When should a premature newborn undergo Retinopathy of Prematurity (ROP) screening?',
      hi: 'समय से पहले जन्मे (प्रीमैच्योर) शिशु की ROP जांच कब करानी चाहिए?'
    },
    answer: {
      en: 'Strict national clinical guidelines mandate that premature babies born at less than 34 weeks of gestation, or weighing under 1,750 grams at birth, or those who received prolonged oxygen support in NICU must be screened within 20 to 30 days of birth (ideally by the 4th week of life). In very premature infants (<28 weeks), screening is done by 2 to 3 weeks of age. Timely laser or anti-VEGF intervention prevents irreversible childhood blindness.',
      hi: '34 सप्ताह से पहले जन्मे या 1,750 ग्राम से कम वजन वाले शिशुओं की पहली आर.ओ.पी जांच जन्म के 20 से 30 दिनों के भीतर अवश्य हो जानी चाहिए। समय पर जांच और उपचार से बच्चे की दृष्टि को जीवन भर के लिए सुरक्षित किया जा सकता है।'
    },
    keyTakeaway: 'Mandatory within 20–30 days of birth for premature or low-birth-weight babies (Tees Din Roshni Ke).',
    ctaText: 'ROP Screening Details',
    ctaLink: '/services'
  },
  {
    id: 'cataract-lens-options',
    category: 'cataract',
    categoryLabel: 'Intraocular Lenses',
    question: {
      en: 'Which intraocular lens (IOL) is best: Monofocal, Toric, or Multifocal?',
      hi: 'मोतियाबिंद में कौन सा लेंस सबसे अच्छा है: मोनोफोकल, टॉरिक या मल्टीफोकल?'
    },
    answer: {
      en: 'The optimal lens choice depends on your corneal astigmatism, retinal health, lifestyle, and visual demands. Monofocal IOLs offer razor-sharp distance vision (reading glasses needed). Toric IOLs correct corneal cylindrical astigmatism. Extended Depth of Focus (EDOF) and Trifocal lenses provide independence from glasses for distance, computer, and reading. Dr. Gaur performs computerized optical biometry to help you select the safest, most suitable lens.',
      hi: 'लेंस का चयन आपकी आंखों की बनावट, पर्दे के स्वास्थ्य और दैनिक आवश्यकताओं पर निर्भर करता है। मोनोफोकल लेंस दूर की स्पष्ट दृष्टि देते हैं, जबकि टॉरिक लेंस एस्टिग्मेटिज्म (सिलेंडर नंबर) को ठीक करते हैं। ईडॉफ या ट्राइफोकल लेंस से चश्मे पर निर्भरता काफी कम हो जाती है।'
    },
    keyTakeaway: 'High-precision optical biometry determines the ideal customized IOL choice based on retinal health.',
    ctaText: 'Explore Surgical Facilities',
    ctaLink: '/technology'
  },
  {
    id: 'cashless-insurance',
    category: 'insurance',
    categoryLabel: 'Insurance & TPA',
    question: {
      en: 'Do you offer cashless mediclaim insurance and reimbursement support?',
      hi: 'क्या यहां कैशलेस मेडिक्लेम और रीइम्बर्समेंट की सुविधा उपलब्ध है?'
    },
    answer: {
      en: 'Yes. Our dedicated patient-care desk provides full documentation assistance for all leading health insurance providers and TPAs. We prepare detailed itemized bills, operative notes, discharge summaries, and pre-authorization requests for daycare surgical procedures such as micro-incision cataract surgery, vitrectomy, and intravitreal anti-VEGF injections.',
      hi: 'जी हाँ, हमारे क्लिनिक में सभी प्रमुख बीमा कंपनियों व टीपीए (TPA) के लिए आवश्यक समस्त दस्तावेज, डिस्चार्ज समरी, ऑपरेशन नोट्स और बिलिंग सहायता उपलब्ध कराई जाती है।'
    },
    keyTakeaway: 'Full support for insurance pre-authorization and reimbursement paperwork for all day-care procedures.',
    ctaText: 'Contact Billing Desk',
    ctaLink: '/contact'
  },
  {
    id: 'laser-treatment-safety',
    category: 'retina',
    categoryLabel: 'Retina Green Laser',
    question: {
      en: 'Is retinal green laser treatment safe and does it hurt?',
      hi: 'क्या रेटिना ग्रीन लेजर सुरक्षित है और क्या इसमें दर्द होता है?'
    },
    answer: {
      en: 'Retinal photocoagulation (532nm Green Laser) is an OPD day-care procedure used to seal retinal tears, prevent retinal detachment, and treat diabetic retinopathy. It is completely non-invasive and performed while you sit comfortably at a slit-lamp. Topical anesthetic drops are applied first. Patients may perceive bright flashes of light and mild prickling warmth, but no surgical pain. You can return home immediately after the 10-minute session.',
      hi: '532nm ग्रीन लेजर एक सुरक्षित ओपीडी प्रक्रिया है। आंख में सुन्न करने की दवा डालकर यह प्रक्रिया केवल 10 मिनट में पूरी हो जाती है। मरीज तुरंत घर लौट सकते हैं और कोई बड़ा परहेज नहीं होता।'
    },
    keyTakeaway: 'Quick 10-minute OPD procedure; seals tears and prevents retinal detachment with zero surgical cutting.',
    ctaText: 'View Laser Tech',
    ctaLink: '/technology'
  },
  {
    id: 'emergency-signs',
    category: 'retina',
    categoryLabel: 'Emergency Triage',
    question: {
      en: 'What eye symptoms require immediate same-day emergency medical attention?',
      hi: 'आंखों के कौन से लक्षणों पर तुरंत इमरजेंसी डॉक्टर को दिखाना चाहिए?'
    },
    answer: {
      en: 'You must seek immediate same-day ophthalmic consultation if you experience: (1) Sudden total or partial loss of vision in one eye, (2) Sudden shower of dark floaters or persistent bright lightning flashes of light, (3) A dark curtain or shadow falling across your visual field (classic retinal detachment sign), (4) Severe sudden ocular pain with redness and nausea, or (5) Direct blunt eye trauma or chemical splash.',
      hi: 'यदि अचानक आंख की रोशनी चली जाए, अचानक बहुत सारे काले धब्बे या बिजली जैसी चमक (फ्लैशेज) दिखाई दें, दृष्टि के सामने काला पर्दा आ जाए, या आंख में गंभीर चोट लगे—तो तुरंत बिना देरी किए विशेषज्ञ डॉक्टर को दिखाएं।'
    },
    keyTakeaway: 'Sudden vision loss, dark curtain, showers of floaters, and trauma receive immediate triage priority.',
    ctaText: 'Call Clinic Emergency',
    ctaLink: 'tel:+917554928200'
  }
];

// Top 5 compact questions for the homepage FAQ accordion
export const HOMEPAGE_FAQS = ALL_FAQS.slice(0, 5);
