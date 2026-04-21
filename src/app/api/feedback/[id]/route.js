import { db_connect } from "@/database";
import { FeedbackModel } from "@/database/models/feedbackModel";
import { deleteFile } from "@/lib/deleteFile";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
export async function DELETE(request, context) {
  const { id } = await context.params;
  console.log(id)
  try {
    await db_connect();
    const feedback = await FeedbackModel.findById(id);
    if (!feedback) {
      return NextResponse({ error: "Feedback not found" }, { status: 404 });
    }
    const deleteFeedback = await FeedbackModel.findByIdAndDelete(
      id
    );
    if (!deleteFeedback) {
      return NextResponse(
        { error: "Feedback deletion failed" },
        { status: 500 }
      );
    }
    deleteFile("feedback", deleteFeedback.image);
    const paths = ["/", "/about"];
    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(
      { message: "Feedback deleted successfully" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
