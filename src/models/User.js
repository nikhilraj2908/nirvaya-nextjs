import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, default: '' },
    passwordHash: { type: String, required: true },
    roleId: { type: String, required: true, index: true },
    isActive: { type: Boolean, default: true },
    avatar: { type: String, default: null },
    lastLoginAt: { type: String, default: null }
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

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
