import mongoose from 'mongoose';

const idempotencySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    requestHash: { type: String, required: true },
    responseStatus: { type: Number, required: true },
    responseBody: { type: mongoose.Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now, expires: 86400 } // TTL 24 hours
  },
  { timestamps: true }
);

export const IdempotencyKey = mongoose.models.IdempotencyKey || mongoose.model('IdempotencyKey', idempotencySchema);
export default IdempotencyKey;
