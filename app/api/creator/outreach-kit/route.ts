import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { ratelimit } from "@/lib/ratelimit";

import { generateBrandOutreach } from "@/lib/creator/gemini";

export async function POST(req: Request) {
  try {
    console.log(
      "===== OUTREACH ROUTE HIT ====="
    );

    const body =
      await req.json();

    const {
      creatorName,
      creatorNiche,
      platform,
      followers,
      targetBrandCategory,
    } = body;

    if (
      !creatorName ||
      !creatorNiche ||
      !platform ||
      !followers ||
      !targetBrandCategory
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

    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

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

    const {
      success,
    } =
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

    const {
      data: profile,
    } =
      await supabase
        .from("profiles")
        .select(
          `
          credits_remaining
        `
        )
        .eq(
          "id",
          user.id
        )
        .single();

    if (
      !profile ||
      profile.credits_remaining <=
        0
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

    const outreachKit =
      await generateBrandOutreach(
        {
          creatorName,
          creatorNiche,
          platform,
          followers,
          targetBrandCategory,
        }
      );

    const {
      data,
      error:
        creditError,
    } =
      await supabase.rpc(
        "decrement_credits",
        {
          uid: user.id,
          amount: 1,
        }
      );

      await supabase.rpc(
  "increment_creator_outreach",
  {
    uid: user.id,
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

    console.log(
      "===== OUTREACH COMPLETE ====="
    );

    return NextResponse.json(
      outreachKit
    );
  } catch (error: any) {
    console.error(
      "===== OUTREACH ROUTE ERROR =====",
      error
    );

    if (
      error?.status === 429
    ) {
      return NextResponse.json(
        {
          error:
            "Too many requests. Please wait a moment and try again.",
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
          "Brand Outreach is experiencing high demand right now. Please try again in a moment.",
      },
      {
        status: 500,
      }
    );
  }
}