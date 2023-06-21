import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
  {
    creator: { type: String },
    fullName: { type: String },
    title: String,
    content: String,
    postImage: String,
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('post', postSchema);
