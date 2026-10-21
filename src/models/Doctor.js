import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    qualification: { type: String, required: true },
    designation: { type: String, required: true },
    specialties: [{ type: String }],
    experienceYears: { type: Number, default: 10 },
    biography: { type: String, default: '' },
    image: { type: String, default: '/assets/dr-sandhya-gaur.webp' },
    education: [{ type: String }],
    awards: [{ type: String }],
    availableDays: [{ type: String }],
    availableSlots: [{ type: String }],
    consultationFee: { type: Number, default: null },
    isActive: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 1 }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
export default Doctor;
