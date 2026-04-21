import mongoose, { models } from "mongoose";
const feedbackSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    feedbackDate: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const FeedbackModel =
  models.Feedback || mongoose.model("Feedback", feedbackSchema);
