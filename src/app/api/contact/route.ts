import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, message, subject } = await req.json();

    await resend.emails.send({
      from: "Madan Website <onboarding@resend.dev>",
      to: ["madan.ministries@gmail.com"],

      subject,

      html: `
        <h2>New Website Contact Form Submission</h2>

        <p><strong>From:</strong> ${email}</p>

        <p><strong>Message:</strong></p>

        <p>${message}</p>
      `,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}