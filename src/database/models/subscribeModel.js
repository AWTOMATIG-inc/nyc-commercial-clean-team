import mongoose, { models } from "mongoose";
const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
  },
  { timestamps: true }
);

export const SubscriberModel =
  models.Subscriber || mongoose.model("Subscriber", subscriberSchema);
