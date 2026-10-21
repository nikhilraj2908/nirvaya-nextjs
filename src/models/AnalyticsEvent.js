import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema(
  {
    eventType: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    path: { type: String, default: '/' },
    referrer: { type: String, default: '' },
    device: { type: String, default: 'desktop' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, index: true }
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

analyticsEventSchema.index({ eventType: 1, timestamp: -1 });

export const AnalyticsEvent = mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', analyticsEventSchema);
export default AnalyticsEvent;
