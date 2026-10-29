import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    bookingRef: { type: String, required: true, unique: true, index: true },
    patientName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, index: true },
    age: { type: Number, default: null },
    city: { type: String, default: 'Bhopal' },
    specialty: { type: String, default: 'Retina & Vitreoretinal Surgery', index: true },
    preferredDate: { type: String, required: true, index: true },
    preferredSlot: { type: String, required: true },
    doctorId: { type: String, default: 'doc-sandhya-01', index: true },
    slotId: { type: String, default: null, index: true },
    startTimeUtc: { type: String, default: null },
    endTimeUtc: { type: String, default: null },
    email: { type: String, default: null, trim: true },
    reason: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'pending', 'confirmed', 'in_consultation', 'completed', 'cancelled', 'no_show'],
      default: 'confirmed',
      index: true
    },
    internalNotes: { type: String, default: '' },
    assignedDoctor: { type: String, default: 'Dr Sandhya Gaur (MD AIIMS)' },
    source: { type: String, default: 'website' },
    sessionId: { type: String, default: null }
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

appointmentSchema.index({ doctorId: 1, preferredDate: 1, slotId: 1, status: 1 });

if (mongoose.models.Appointment) {
  delete mongoose.models.Appointment;
}
export const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
