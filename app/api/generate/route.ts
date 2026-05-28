

import { NextResponse } from "next/server";
import { generateDescriptions } from "@/lib/gemini";
import { createClient } from "@/lib/supabase/server";
import { VariantKey } from "@/lib/prompt";
import { ratelimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  try {
    console.log("===== GENERATE ROUTE HIT =====");

    const body = await req.json();
    const { productName, features, platform, tone, language, onlyVariant, price } = body;

    // onlyVariant is optional — only present on regenerate calls
    const isRegenerate = !!onlyVariant;

    if (!productName || !features || !platform || !tone || !language) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // validate onlyVariant if provided
    if (onlyVariant && !["v1", "v2", "v3"].includes(onlyVariant)) {
      return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { success } =
  await ratelimit.limit(
    user.id
  );

if (!success) {
  return NextResponse.json(
    {
      error:
        "Too many requests. Please slow down.",
    },
    {
      status: 429,
    }
  );
}

    // credits check — always required regardless of regenerate or full
   const { data: profile } = await supabase
  .from("profiles")
  .select(`
    credits_remaining,
    brand_name,
    brand_tone,
    target_audience,
    writing_style,
    preferred_cta,
    platform_tones,
    free_image_analysis_date,
    free_image_analyses_used
  `)
  .eq("id", user.id)
  .single();

    if (!profile || profile.credits_remaining <= 0) {
      return NextResponse.json(
        { error: "No credits remaining. Please upgrade.", code: "NO_CREDITS" },
        { status: 403 }
      );
    }

    // generate — full or single variant
   const descriptions =
  await generateDescriptions(
    {
      productName,
      features,
      platform,
      tone,
      language,
       price: price ?? undefined,
    },

    onlyVariant as
      VariantKey | undefined,

    {
      brand_name:
        profile?.brand_name ?? undefined,

      brand_tone:
        profile?.brand_tone ?? undefined,

      target_audience:
        profile?.target_audience ?? undefined,

      writing_style:
        profile?.writing_style ?? undefined,

      preferred_cta:
        profile?.preferred_cta ?? undefined,

      platform_tones:  profile.platform_tones  ?? undefined,
    }
  );

    // only save to DB on full generation, not on individual regenerates
    // (regenerate just replaces one variant in the UI, no new history row needed)
    if (!isRegenerate) {
      const { error: insertError } = await supabase
        .from("generations")
        .insert({
          user_id: user.id,
          product_name: productName,
          features,
          platform,
          tone,
          language,
          output_v1: descriptions.v1,
          output_v2: descriptions.v2,
          output_v3: descriptions.v3,
        });

      if (insertError) {
        console.error("INSERT ERROR:", insertError);
        // don't fail the request — generation succeeded
      }
    }

    // deduct 1 credit on every call (full or regenerate)
    const { data, error: creditError } =
  await supabase.rpc(
    "decrement_credits",
    {
      uid: user.id,
      amount: 1, 
    }
  );

console.log(
  "CREDIT RPC DATA:",
  data
);

console.log(
  "CREDIT RPC ERROR:",
  creditError
);

    console.log("===== REQUEST COMPLETE =====");
    
    return NextResponse.json(
      {descriptions:descriptions, freeImageAnalysisDate: profile?.free_image_analysis_date, freeImageAnalysesUsed: profile?.free_image_analyses_used }
    );

  } catch (error: any) {
    console.error("===== ROUTE ERROR =====", error);

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "AI returned invalid output. Please try again." },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "AI generation servers are experiencing high demand right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}