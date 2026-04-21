import { db_connect } from "@/database";
import { BookingModel } from "@/database/models/bookingModel";
import { UserModel } from "@/database/models/userModel";
import { transporter } from "@/lib/transporter";
import { GetTime } from "@/utility/GetTime";
import { NextResponse } from "next/server";
export async function GET(request, context) {
  const { id } = await context.params;
  console.log(UserModel);
  try {
    await db_connect();
    const booking = await BookingModel.findById(id).populate("author");

    if (!booking) {
      return new NextResponse("Booking not found", { status: 404 });
    }

    return NextResponse.json(booking, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json("something went wrong", { status: 500 });
  }
}
export async function DELETE(request, context) {
  const { id } = await context.params;
  console.log(UserModel);

  try {
    await db_connect();
    const deleteBooking = await BookingModel.findByIdAndDelete(id);
    if (!deleteBooking) {
      return new NextResponse(
        { error: "Booking deletion failed" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "Booking deleted successfully" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
export async function PUT(request, context) {
  const { id } = await context.params;
  const formData = await request.formData();
  const { status } = Object.fromEntries(formData);
  if (!formData.has("status")) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }
  try {
    await db_connect();
    const editBooking = await BookingModel.findByIdAndUpdate(id, { status });
    if (!editBooking) {
      return new NextResponse(
        { error: "Booking deletion failed" },
        { status: 500 },
      );
    }
    let statusMessage = "";

    if (status === "pending") {
      statusMessage =
        "Your booking is currently pending review. We will update you soon.";
    } else if (status === "confirmed") {
      statusMessage =
        "Great news! Your booking has been confirmed successfully.";
    } else if (status === "cenceled") {
      statusMessage =
        "We regret to inform you that your booking has been canceled. Please contact us for more information.";
    }
    const mail_html = `
          <div>
          <p>Dear ${editBooking.firstName + " " + editBooking.lastName}</p>
          <p> Your booking status has been updated. Please check the latest details below: </p>
          <h3 style="margin-top:20px;">Booking Information:</h3>
          <ul style="padding-left:20px;">
          <li><strong>Booking ID:</strong> ${editBooking.bookingId}</li>
          <li><strong>Booking Date:</strong> ${GetTime(editBooking.createdAt)}</li>
          <li><strong>Status:</strong> ${status}</li>
          </ul>
          <p>${statusMessage}</p>
          </div>
        `;
    const mailOptions = {
      from: process.env.EMAIL,
      to: editBooking.email,
      subject: `Your Booking Status Has Been Updated Form NYC`,
      html: mail_html,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Booking updated successfully" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
