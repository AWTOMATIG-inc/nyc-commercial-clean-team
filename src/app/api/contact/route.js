import { escapeHtml, isEmail, isNonEmptyString, pickStrings } from "@/lib/sanitize";
import { transporter } from "@/lib/transporter";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const { name, email, phone, subject, message } = pickStrings(
    Object.fromEntries(formData),
    ["name", "email", "phone", "subject", "message"],
    5000,
  );
  if (
    !isNonEmptyString(name) ||
    !isEmail(email) ||
    !isNonEmptyString(phone) ||
    !isNonEmptyString(subject) ||
    !isNonEmptyString(message)
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  try {
    const mail_html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message)}</p>
      </div>
    `;
    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: subject.replace(/[\r\n]+/g, " ").slice(0, 200),
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
