import Razorpay from "razorpay";

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const razorpay = new Razorpay({
  key_id:
    process.env
      .NEXT_PUBLIC_RAZORPAY_KEY_ID!,

  key_secret:
    process.env
      .RAZORPAY_KEY_SECRET!,
});

export async function POST(
  req: Request
) {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { plan, amount } =
      await req.json();

    if (!plan || !amount) {
      return NextResponse.json(
        {
          error:
            "Missing plan or amount",
        },
        {
          status: 400,
        }
      );
    }

    const order =
      await razorpay.orders.create({
        amount: amount * 100,

        currency: "INR",

        receipt: `receipt_${Date.now()}`,

        notes: {
          userId: user.id,

          plan,
        },
      });

    return NextResponse.json({
      orderId: order.id,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to create order",
      },
      {
        status: 500,
      }
    );
  }
}