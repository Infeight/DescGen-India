import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/service";  

const PLAN_CREDITS: Record<string, number> = {
  starter:  100,
  pro:      500,
  business: 999999,
};

export async function POST(req: Request) {
  try {
    console.log("===== WEBHOOK HIT =====");

    const body      = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return new Response("Missing signature", { status: 400 });
    }

    // verify signature
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expected !== signature) {
      console.log("SIGNATURE MISMATCH");
      return new Response("Unauthorized", { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("EVENT TYPE:", event.event);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const userId  = payment.notes?.userId;
      const plan    = payment.notes?.plan;

      console.log("USER ID:", userId);
      console.log("PLAN:", plan);

      if (!userId || !plan) {
        return new Response("Missing notes", { status: 400 });
      }

      // ✅ supabaseAdmin bypasses RLS — no cookie needed
      const { data: updatedProfile, error: profileUpdateError } =
        await supabaseAdmin
          .from("profiles")
          .update({
            plan,
            credits_remaining: PLAN_CREDITS[plan] ?? 100,
          })
          .eq("id", userId)
          .select()
          .single();

      console.log("UPDATED PROFILE:", updatedProfile);
      console.log("PROFILE UPDATE ERROR:", profileUpdateError);

      if (profileUpdateError) {
        console.error("PROFILE UPDATE FAILED:", profileUpdateError);
        return new Response("Profile update failed", { status: 500 });
      }

      // log payment
      const { error: paymentError } = await supabaseAdmin
        .from("payments")
        .insert({
          user_id:             userId,
          razorpay_payment_id: payment.id,
          razorpay_order_id:   payment.order_id,
          amount_inr:          payment.amount / 100,
          plan,
          status:              "captured",
        });

      console.log("PAYMENT INSERT ERROR:", paymentError);
      console.log("===== WEBHOOK SUCCESS =====");
    }

    return new Response("OK");

  } catch (error) {
    console.error("===== WEBHOOK ERROR =====", error);
    return new Response("Webhook failed", { status: 500 });
  }
}