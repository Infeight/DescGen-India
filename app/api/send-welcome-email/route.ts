import { NextResponse } from "next/server";

import { sendWelcomeEmail } from "@/lib/email";

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          error:
            "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    await sendWelcomeEmail(
      email
    );

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error(
      "Send welcome email error:",
      err
    );

    return NextResponse.json(
      {
        error:
          "Failed to send email",
      },
      {
        status: 500,
      }
    );
  }
}