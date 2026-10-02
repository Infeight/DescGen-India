// import { NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/server";
// import { calculatePricing } from "@/lib/creator/pricing/engine";
// import type { PricingInput } from "@/lib/creator/pricing/types";

// export async function POST(req: Request) {
//   try {
//     console.log("===== PRICE NEGOTIATOR ROUTE HIT =====");

//     const body = (await req.json()) as PricingInput;

//     console.log("PRICING INPUT:", body);

//     const supabase = await createClient();

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       return NextResponse.json(
//         {
//           error: "You must be logged in to use Price Negotiator.",
//         },
//         { status: 401 }
//       );
//     }

//     const result = calculatePricing(body);

//     console.log("PRICING RESULT:", result);

//     return NextResponse.json(result, {
//       status: 200,
//     });
//   } catch (error: any) {
//     console.error(
//       "===== PRICE NEGOTIATOR ERROR =====",
//       error
//     );

//     return NextResponse.json(
//       {
//         error:
//           error?.message ||
//           "Unable to calculate your pricing right now.",
//       },
//       {
//         status: 400,
//       }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculatePricing } from "@/lib/creator/pricing/engine";
import type { PricingInput } from "@/lib/creator/pricing/types";

export async function POST(req: Request) {
  try {
    console.log("===== PRICE NEGOTIATOR ROUTE HIT =====");

    const body = (await req.json()) as PricingInput;

    console.log("PRICING INPUT:", body);

    const supabase = await createClient();

    // --------------------------------------------------
    // 1. Check authentication
    // --------------------------------------------------
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "You must be logged in to use Price Negotiator.",
        },
        { status: 401 }
      );
    }

    // --------------------------------------------------
    // 2. Calculate pricing FIRST
    // --------------------------------------------------
    const result = calculatePricing(body);

    console.log("PRICING RESULT:", result);

    // --------------------------------------------------
    // 3. Deduct ONE credit only after successful calculation
    // --------------------------------------------------
    const { error: creditError } = await supabase.rpc(
      "decrement_one_credit",
      {
        p_uid: user.id,
      }
    );

    if (creditError) {
      console.error(
        "PRICE NEGOTIATOR CREDIT ERROR:",
        creditError
      );

      return NextResponse.json(
        {
          error:
            "Unable to use a credit for this calculation. Please try again.",
        },
        { status: 500 }
      );
    }

    console.log(
      `Price Negotiator: 1 credit deducted for user ${user.id}`
    );

    // --------------------------------------------------
    // 4. Return pricing result
    // --------------------------------------------------
    return NextResponse.json(
      {
        ...result,
        creditsUsed: 1,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(
      "===== PRICE NEGOTIATOR ERROR =====",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to calculate your pricing right now.",
      },
      {
        status: 400,
      }
    );
  }
}