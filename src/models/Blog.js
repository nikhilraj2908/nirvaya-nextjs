import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    excerpt: { type: String, default: '' },
    body: { type: String, required: true },
    category: { type: String, default: 'Retina', index: true },
    tags: [{ type: String }],
    coverImage: { type: String, default: '' },
    coverAlt: { type: String, default: '' },
    author: { type: String, default: 'Dr. Sandhya Gaur (MD AIIMS)' },
    readingMinutes: { type: Number, default: 5 },
    status: { type: String, enum: ['published', 'draft', 'archived'], default: 'published', index: true },
    viewsCount: { type: Number, default: 0 },
    publishedAt: { type: String, default: null, index: true }
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

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;
