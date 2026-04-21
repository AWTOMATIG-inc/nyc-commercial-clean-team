import { db_connect } from "@/database";
import { BookingModel } from "@/database/models/bookingModel";
import { transporter } from "@/lib/transporter";
import { GetTime } from "@/utility/GetTime";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
const serializedNumber = (number) => {
  let newNum;
  if (number < 10) {
    newNum = "00" + number;
  } else if (number < 100) {
    newNum = "0" + number;
  } else {
    newNum = number;
  }
  return newNum;
};
export async function POST(request) {
  const formData = await request.formData();
  const bookingFormData = Object.fromEntries(formData);
  const { email, firstName, lastName, notes, phone } = bookingFormData;
  try {
    await db_connect();
    const total = await BookingModel.countDocuments();
    const bookingData = await BookingModel.create({
      ...bookingFormData,
      services: JSON.parse(bookingFormData.services),
      bookingId:serializedNumber(total + 1),
    });
    if (!bookingData) {
      return NextResponse.json(
        { error: "booking creation failed" },
        { status: 500 },
      );
    }
    const mail_html = `
      <div>
      <p>Hello Admin,</p>
      <p>A new booking has been submitted by a customer. Please review the details below:</p>
      <h3 style="margin-top:20px;">Customer Information:</h3>
      <ul style="padding-left:20px;">
      <li><strong>Name:</strong> ${firstName + "" + lastName}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Phone:</strong> ${phone}</li>
      </ul>
      <h3 style="margin-top:20px;">Booking Details:</h3>
      <ul style="padding-left:20px;">
      <li><strong>Booking ID:</strong> ${bookingData.bookingId}</li>
      <li><strong>Booking Date:</strong> ${GetTime(bookingData.createdAt)}</li>
      <li><strong>Message:</strong> ${notes}</li>
      </ul>
      <p style="margin-top:20px;"> Please log in to the admin panel to manage this booking. </p> <p>Regards,<br />Booking System</p> </div>
    `;
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: `New Booking Submission Received from ${firstName+""+lastName}`,
      html: mail_html,
    };

    await transporter.sendMail(mailOptions);

    const paths = ["/", "/dashboard/bookings"];
    paths.forEach((p) => revalidatePath(p));
    return NextResponse.json(bookingData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const query = Object.fromEntries(searchParams);
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;
  let searchQuery = {};
  if (query) {
    if (query.status !== "all") {
      searchQuery.status = query.status;
    }
  }
  try {
    await db_connect();
    const bookings = await BookingModel.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await BookingModel.countDocuments();
    const bookingData = {
      success: true,
      data: bookings,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        totalPages: Math.ceil(total / limit),
      },
      message: "All booking fetched successfully",
    };
    return NextResponse.json(bookingData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 },
    );
  }
}
