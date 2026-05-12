// app/api/bulk/route.ts
import { NextResponse } from "next/server";
import { generateDescriptions } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productName, features, platform, tone, language } = body;

    if (!productName || !features || !platform || !tone || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // check credits — need at least 0.5
   const { data: profile } = await supabase
  .from("profiles")
  .select(`
    credits_remaining,
    plan,
    brand_name,
    brand_tone,
    target_audience,
    writing_style,
    preferred_cta,
    platform_tones
  `)
  .eq("id", user.id)
  .single();
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // free plan users cannot use bulk at all
    if (profile.plan === "free") {
      return NextResponse.json(
        { error: "Bulk CSV is a Pro feature. Please upgrade.", code: "UPGRADE_REQUIRED" },
        { status: 403 }
      );
    }

    // pro/business users need at least 0.5 credits
    if (profile.credits_remaining < 0.5) {
      return NextResponse.json(
        { error: "No credits remaining. Please upgrade.", code: "NO_CREDITS" },
        { status: 403 }
      );
    }

   const descriptions =
  await generateDescriptions(
    {
      productName,
      features,
      platform,
      tone,
      language,
    },

    undefined,

    {
      brand_name:
        profile?.brand_name ?? undefined,

      brand_tone:
        profile?.brand_tone ?? undefined ,

      target_audience:
        profile?.target_audience ?? undefined,

      writing_style:
        profile?.writing_style ?? undefined,

      preferred_cta:
        profile?.preferred_cta ?? undefined,

      platform_tones:  profile.platform_tones  ?? undefined,
    }
  );
    // save to history
    await supabase.from("generations").insert({
      user_id:      user.id,
      product_name: productName,
      features,
      platform,
      tone,
      language,
      output_v1:    descriptions.v1,
      output_v2:    descriptions.v2,
      output_v3:    descriptions.v3,
    });

    // deduct 0.5 credits for bulk — half price vs single generation
    await supabase.rpc("decrement_credits", {
      uid:    user.id,
      amount: 0.5,      
    });

    return NextResponse.json(descriptions);

  } catch (error: any) {
    console.error("[/api/bulk]", error);

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Too many requests. Please try again." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}