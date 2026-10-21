import mongoose from 'mongoose';

const researchPaperSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    authors: { type: String, required: true },
    journal: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    volume: { type: String, default: '' },
    issue: { type: String, default: '' },
    pages: { type: String, default: '' },
    abstract: { type: String, default: '' },
    doi: { type: String, default: '' },
    scholarUrl: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    specialty: { type: String, default: 'Retina', index: true },
    citationsCount: { type: Number, default: 0 },
    keywords: [{ type: String }]
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

export const ResearchPaper = mongoose.models.ResearchPaper || mongoose.model('ResearchPaper', researchPaperSchema);
export default ResearchPaper;
