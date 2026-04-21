import mongoose, { models } from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    slug: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const BlogModel = models.Blog || mongoose.model("Blog", blogSchema);
