import { transporter } from "@/lib/transporter";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  console.log(Object.fromEntries(formData));
  if (
    !formData.has("name") ||
    !formData.has("email") ||
    !formData.has("phone") ||
    !formData.has("subject") ||
    !formData.has("message")
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }
  const { name, email, phone, subject, message } = Object.fromEntries(formData);

  try {
    const mail_html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
    `;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: `${subject}`,
      html: mail_html,
      attachments: [],
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error({ error: "Error sending email" }, error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
