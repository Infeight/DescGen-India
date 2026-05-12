// app/api/bulk/route.ts

import { NextResponse } from "next/server";

import { generateDescriptions } from "@/lib/gemini";

import { createClient } from "@/lib/supabase/server";

import {
  bulkRatelimit,
} from "@/lib/ratelimit";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      productName,
      features,
      platform,
      tone,
      language,
    } = body;

    // Basic validation
    if (
      !productName ||
      !features ||
      !platform ||
      !tone ||
      !language
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    // Payload protection
    if (
      productName.length > 200 ||
      features.length > 5000
    ) {
      return NextResponse.json(
        {
          error:
            "Input too large.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    // Auth check
    if (!user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // Bulk-specific rate limit
    const { success } =
      await bulkRatelimit.limit(
        `bulk-${user.id}`
      );

    if (!success) {
      return NextResponse.json(
        {
          error:
            "Too many bulk requests. Please wait a moment.",
        },
        {
          status: 429,
        }
      );
    }

    // Fetch profile
    const {
      data: profile,
    } = await supabase
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
      return NextResponse.json(
        {
          error:
            "Profile not found",
        },
        {
          status: 404,
        }
      );
    }

    // Free users blocked
    if (
      profile.plan ===
      "free"
    ) {
      return NextResponse.json(
        {
          error:
            "Bulk CSV is a Pro feature. Please upgrade.",

          code:
            "UPGRADE_REQUIRED",
        },
        {
          status: 403,
        }
      );
    }

    // Credits check
    if (
      profile.credits_remaining <
      0.5
    ) {
      return NextResponse.json(
        {
          error:
            "No credits remaining. Please upgrade.",

          code:
            "NO_CREDITS",
        },
        {
          status: 403,
        }
      );
    }

    // Generate AI descriptions
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
            profile?.brand_name ??
            undefined,

          brand_tone:
            profile?.brand_tone ??
            undefined,

          target_audience:
            profile?.target_audience ??
            undefined,

          writing_style:
            profile?.writing_style ??
            undefined,

          preferred_cta:
            profile?.preferred_cta ??
            undefined,

          platform_tones:
            profile?.platform_tones ??
            undefined,
        }
      );

    // Save generation history
    const {
      error: insertError,
    } = await supabase
      .from("generations")
      .insert({
        user_id:
          user.id,

        product_name:
          productName,

        features,

        platform,

        tone,

        language,

        output_v1:
          descriptions.v1,

        output_v2:
          descriptions.v2,

        output_v3:
          descriptions.v3,
      });

    if (insertError) {
      console.error(
        "HISTORY INSERT ERROR:",
        insertError
      );
    }

    // Deduct credits
    const {
      error: creditError,
    } = await supabase.rpc(
      "decrement_credits",
      {
        uid: user.id,

        amount: 0.5,
      }
    );

    if (creditError) {
      console.error(
        "CREDIT RPC ERROR:",
        creditError
      );
    }

    return NextResponse.json(
      descriptions
    );

  } catch (error: any) {
    console.error(
      "[/api/bulk]",
      error
    );

    if (
      error?.status ===
      429
    ) {
      return NextResponse.json(
        {
          error:
            "Too many requests. Please try again.",
        },
        {
          status: 429,
        }
      );
    }

    if (
      error instanceof
      SyntaxError
    ) {
      return NextResponse.json(
        {
          error:
            "AI returned invalid output. Please try again.",
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Generation failed. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}