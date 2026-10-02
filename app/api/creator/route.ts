import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { ratelimit } from "@/lib/ratelimit";
import { generateCreatorKit } from "@/lib/creator/gemini";

export async function POST(req: Request) {
  try {
    console.log(
      "===== CREATOR ROUTE HIT ====="
    );

    const body = await req.json();

    const {
      productName,
      productDetails,
      niche,
      platform,
    } = body;

    // Validate

    if (
      !productName ||
      !productDetails ||
      !niche ||
      !platform
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

    // Auth

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

    // Rate limit

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

    // Credits check

    const {
      data: profile,
    } =
      await supabase
        .from("profiles")
        .select(`
          credits_remaining
        `)
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
          code: "NO_CREDITS",
        },
        {
          status: 403,
        }
      );
    }

    // Generate

    const creatorKit =
      await generateCreatorKit(
        {
          productName,
          productDetails,
          niche,
          platform,
            image: null
        }
      );

    // Deduct credit

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
  "increment_creator_content_kits",
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
      "===== CREATOR REQUEST COMPLETE ====="
    );

    console.log(creatorKit);

    return NextResponse.json(
      creatorKit
    );
  }
  //  catch (error: any) {
  //   console.error(
  //     "===== CREATOR ROUTE ERROR =====",
  //     error
  //   );

  //   if (
  //     error?.status === 429
  //   ) {
  //     return NextResponse.json(
  //       {
  //         error:
  //           "Too many requests. Please wait a moment and try again.",
  //       },
  //       {
  //         status: 429,
  //       }
  //     );
  //   }

  //   if (
  //     error instanceof
  //     SyntaxError
  //   ) {
  //     return NextResponse.json(
  //       {
  //         error:
  //           "AI returned invalid output. Please try again.",
  //       },
  //       {
  //         status: 502,
  //       }
  //     );
  //   }

  //   return NextResponse.json(
  //     {
  //       error:
  //         "Creator Studio is experiencing high demand right now. Please try again in a moment.",
  //     },
  //     {
  //       status: 500,
  //     }
  //   );
  // }

  catch (error: any) {
  console.error(
    "===== CREATOR ROUTE ERROR ====="
  );

  console.error(
    "ERROR:",
    error
  );

  console.error(
    "MESSAGE:",
    error?.message
  );

  console.error(
    "STACK:",
    error?.stack
  );

  return NextResponse.json(
    {
      error:
        error?.message ||
        "Creator generation failed.",
    },
    {
      status: 500,
    }
  );
}
}