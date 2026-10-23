/**
 * @typedef {Object} DoctorReview
 * @property {string} id - Unique identifier
 * @property {string} quote - Professional peer feedback / observation
 * @property {string} doctorName - e.g. "Dr Sudhanshu Varma"
 * @property {string} designation - e.g. "Consultant Physician"
 * @property {string} hospitalOrClinic - e.g. "Bhopal"
 * @property {string} specialty - e.g. "General Medicine"
 * @property {string} [referralContext] - e.g. "Retinal Vascular Occlusion Referral" (optional)
 * @property {string} [registrationNo] - Optional, shown only if client provides
 * @property {string} [photo] - Optional photo URL, falls back to initials avatar
 * @property {boolean} approved - Only render items where approved === true
 */

// TODO: replace with client-approved reviews
export const DOCTOR_REVIEWS = [
  {
    id: "dr-rev-01",
    doctorName: "Dr Sudhanshu Varma",
    designation: "Consultant Physician",
    hospitalOrClinic: "Bhopal",
    specialty: "General Medicine",
    referralContext: "Retinal Vascular Occlusion Referral",
    registrationNo: "",
    photo: "",
    approved: true,
    quote: "Over the years, I have referred multiple patients presenting with retinal vascular occlusions and macular edema to Dr Sandhya Gaur. Her diagnostic reporting is prompt, thorough, and grounded in standard vitreo-retinal protocols. The clinical feedback loop and patient coordination remain consistently dependable."
  },
  {
    id: "dr-rev-02",
    doctorName: "Dr Nirmala Joshi",
    designation: "Consultant Diabetologist & Endocrinologist",
    hospitalOrClinic: "Bhopal",
    specialty: "Diabetology & Metabolism",
    referralContext: "Diabetic Retinopathy & Maculopathy Referral",
    registrationNo: "",
    photo: "",
    approved: true,
    quote: "Effective management of diabetic eye disease requires timely screening and conservative, protocol-based laser or intravitreal intervention. In our shared diabetic patients, Dr Gaur provides transparent fundus evaluation, clear procedural communication, and unhurried clinical counselling."
  },
  {
    id: "dr-rev-03",
    doctorName: "Dr S. K. Daas",
    designation: "Consultant Neonatologist & Paediatrician",
    hospitalOrClinic: "Bhopal",
    specialty: "Neonatology & Paediatrics",
    referralContext: "Neonatal ROP Screening & Management",
    registrationNo: "",
    photo: "",
    approved: true,
    quote: "Timely retinal evaluation in preterm infants is time-critical. Dr Gaur conducts thorough indirect ophthalmoscopic ROP screening with gentleness and strict adherence to national ROP screening criteria, accompanied by clear updates to parents and attending neonatologists."
  }
];

export default DOCTOR_REVIEWS;
