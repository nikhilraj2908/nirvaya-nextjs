import mongoose from 'mongoose';

const slotConfigSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    slots: [{ type: String }],
    capacityPerSlot: { type: Number, default: 10 }
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

const blockedDateSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    date: { type: String, required: true, unique: true, index: true },
    reason: { type: String, default: 'Holiday' },
    blockedBy: { type: String, default: 'Admin' }
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

export const SlotConfig = mongoose.models.SlotConfig || mongoose.model('SlotConfig', slotConfigSchema);
export const BlockedDate = mongoose.models.BlockedDate || mongoose.model('BlockedDate', blockedDateSchema);

export default {
  SlotConfig,
  BlockedDate
};
