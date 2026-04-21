"use server";
import { db_connect } from "@/database";
import { FeedbackModel } from "@/database/models/feedbackModel";

export const getFeedback = async () => {
  try {
    await db_connect();
    const feedbackData = await FeedbackModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    return JSON.parse(JSON.stringify(feedbackData));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
// export const getFeedback = async () => {
//   try {
//     const res = await fetch(process.env.BASE_URL + "/api/feedback", {
//       cache: "no-store",
//     });
//     if (!res.ok) {
//       throw new Error("feedback fetch failed");
//     }
//     return res.json();
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };
