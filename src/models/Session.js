import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    visitorId: { type: String, default: null },
    ip: { type: String, default: null },
    userAgent: { type: String, default: null },
    device: { type: String, default: 'desktop' },
    firstPath: { type: String, default: '/' },
    lastPath: { type: String, default: '/' },
    pageViews: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now, expires: 2592000 } // 30 days TTL
  },
  { timestamps: true }
);

export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
export default Session;
