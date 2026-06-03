import {
  NextResponse,
} from "next/server";

import { createClient }
from "@/lib/supabase/server";

export async function POST(
  req: Request
) {
  try {
    const {
      feedback,
      platform,
    } = await req.json();

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

    await supabase
      .from(
        "generation_feedback"
      )
      .insert({
        user_id: user.id,

        feedback,

        platform,
      });

    return NextResponse.json({
      success: true,
    });

  } catch {
    return NextResponse.json(
      {
        error:
          "Failed to save feedback",
      },
      {
        status: 500,
      }
    );
  }
}