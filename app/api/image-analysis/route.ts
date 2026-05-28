// app/api/analyze-image/route.ts

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withGeminiRetry } from "@/lib/gemini-retry";
import { createClient } from "@/lib/supabase/server";
import { ratelimit } from "@/lib/ratelimit";
import { PLATFORM_IMAGE_RULES, DEFAULT_IMAGE_RULES } from "@/lib/platform-image-rules";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.3,
  },
});

interface ImageAnalysisResult {
  score: number;
  strengths: string[];
  warnings: string[];
  platformFit: {
    Amazon: number;
    Instagram: number;
    Flipkart: number;
    Meesho: number;
    Myntra: number;
    Facebook: number;
  };
  relevanceScore: number;
matchesProduct: boolean;
relevanceWarning: string;
}

const VALID_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const IMAGE_ANALYSIS_COST = 2;
const FREE_IMAGE_ANALYSES_PER_DAY = 1;

export async function POST(req: Request) {
  try {
    const { image, platform, productName, description } = await req.json();

    const platformRules =
  PLATFORM_IMAGE_RULES[
    platform as keyof typeof PLATFORM_IMAGE_RULES
  ] || DEFAULT_IMAGE_RULES;;

//  ratelimit  
    const supabase = await createClient();

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

const { success } =
  await ratelimit.limit(
    `image-analysis-${user.id}`
  );

if (!success) {
  return NextResponse.json(
    {
      error:
        "Too many image analysis requests. Please slow down.",
    },
    {
      status: 429,
    }
  );
}

//  profile fetch to check credits and free usage
const { data: profile } =
  await supabase
    .from("profiles")
    .select(`
      credits_remaining,
      free_image_analysis_date,
      free_image_analyses_used
    `)
    .eq("id", user.id)
    .single();


//  1 free usage per day, then deduct credits

const today =
  new Date()
    .toISOString()
    .split("T")[0];

let freeUsed =
  profile?.free_image_analyses_used ?? 0;

let freeDate =
  profile?.free_image_analysis_date;

if (freeDate !== today) {
  freeUsed = 0;

  await supabase
    .from("profiles")
    .update({
      free_image_analysis_date:
        today,

      free_image_analyses_used:
        0,
    })
    .eq("id", user.id);
}


const hasFreeAnalysis =
  freeUsed <
  FREE_IMAGE_ANALYSES_PER_DAY;

// in case of insufficient credits
  if (
  !hasFreeAnalysis &&
  (
    !profile ||
    profile.credits_remaining <
      IMAGE_ANALYSIS_COST
  )
) {
  return NextResponse.json(
    {
      error:
        "Insufficient credits for image analysis.",
      code: "NO_CREDITS",
    },
    {
      status: 403,
    }
  );
}

    // --- Input validation ---
    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "A valid base64 image string is required." },
        { status: 400 }
      );
    }

    if (!platform || typeof platform !== "string" || platform.trim().length === 0) {
      return NextResponse.json(
        { error: "A valid platform name is required." },
        { status: 400 }
      );
    }

    const base64Data = image.split(",")[1];



    if (!base64Data) {
      return NextResponse.json(
        { error: "Image must be a valid base64 data URL (e.g. data:image/jpeg;base64,...)." },
        { status: 400 }
      );
    }

    const mimeType = image.match(/data:(.*?);base64/)?.[1] ?? "image/jpeg";

  

    if (!VALID_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: `Unsupported image type: ${mimeType}. Use JPEG, PNG, or WEBP.` },
        { status: 400 }
      );
    }

    const normalizedPlatform = platform.trim();

    const prompt = `
You are a senior ecommerce image quality analyst with expertise in Indian and global marketplace standards.
Your primary job is to evaluate whether this product image is ready to publish on ${normalizedPlatform}, and score its suitability for each platform below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVALUATION CRITERIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Score each of the following (they combine into the overall score):

1. CLARITY & SHARPNESS
   - Is the product in sharp focus with no motion blur?
   - Are edges, textures, and fine details clearly visible?

2. LIGHTING QUALITY
   - Is lighting even with no harsh shadows, overexposure, or color casts?
   - Does the light flatter the product without washing it out?

3. BACKGROUND
   - Is the background clean, uncluttered, and appropriate for ecommerce?
   - Note: white/light gray is standard; lifestyle backgrounds are platform-specific

4. PRODUCT VISIBILITY
   - Is the full product visible and well-framed?
   - Is it large enough in the frame (occupying 80–85% of the image area)?

5. COMPOSITION & CROPPING
   - Is the product centered or intentionally positioned?
   - No unintended cut-offs at edges?

6. PROFESSIONALISM
   - Does it look like a catalog-quality image?
   - No watermarks, text overlays, or irrelevant props?

7. MOBILE FRIENDLINESS
   - Will this look crisp on a 375px mobile screen?
   - Is the product distinguishable at thumbnail size?

8. PLATFORM SUITABILITY FOR ${normalizedPlatform}
   - Judged specifically against the standards listed below

9. Product-image relevance:
Determine whether the uploaded image visually matches the following product information:

PRODUCT TITLE:
${productName}

LISTING DESCRIPTION:
${description}

Compare visible product category, attributes, style, material cues, color expectations, and buyer expectations against the uploaded image.   

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLATFORM-SPECIFIC STANDARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${platformRules}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OVERALL SCORING GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- 85–100: Publication-ready. Meets or exceeds marketplace standards.
- 70–84: Good quality. Minor issues that won't block listing but affect conversion.
- 55–69: Acceptable but suboptimal. Likely to underperform against competitors.
- 40–54: Needs improvement. Several issues that will hurt discoverability and trust.
- 0–39: Not ready. Major quality or compliance issues present.

PLATFORM FIT SCORING (for each platform):
- 85–100: Ready to publish as the main listing image
- 70–84: Usable but not ideal; would benefit from a reshoot
- 55–69: Better as a secondary/gallery image only
- 40–54: Would likely get flagged or suppressed by this platform
- 0–39: Does not meet this platform's image requirements at all

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Maximum 3 strengths and 3 warnings
- Strengths must name the specific quality and why it helps (e.g. "Even diffused lighting eliminates shadows, which improves product clarity on mobile thumbnails")
- Warnings must be specific and actionable (e.g. "Background has a slight warm yellow tint — replace with pure white (RGB 255,255,255) to meet Amazon's main image policy")
- Never say "good image" or "consider improving lighting" — be precise
- platformFit scores must reflect genuine differences across platforms, not all be the same number
- Primary focus platform is ${normalizedPlatform} — give it the most detailed implicit consideration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return ONLY this JSON. No markdown, no explanation, no preamble:
{
  "score": <integer 0–100>,
  "strengths": [
    "<specific strength with reason>",
    "<specific strength with reason>",
    "<specific strength with reason>"
  ],
  "warnings": [
    "<specific actionable warning>",
    "<specific actionable warning>",
    "<specific actionable warning>"
  ],
  "platformFit": {
    "Amazon": <integer 0–100>,
    "Instagram": <integer 0–100>,
    "Flipkart": <integer 0–100>,
    "Meesho": <integer 0–100>,
    "Myntra": <integer 0–100>,
    "Facebook": <integer 0–100>
  },
  "relevanceScore": 0-100,
"matchesProduct": true/false,
"relevanceWarning": "..."
}
`;


// credit deduction logic and free usage tracking

if (hasFreeAnalysis) {
  await supabase
    .from("profiles")
    .update({
      free_image_analysis_date:
        today,

      free_image_analyses_used:
        freeUsed + 1,
    })
    .eq("id", user.id);
} else {
  const { error: creditError } =
    await supabase.rpc(
      "decrement_credits",
      {
        uid: user.id,
        amount:
          IMAGE_ANALYSIS_COST,
      }
    );

  if (creditError) {
    console.error(
      "IMAGE CREDIT ERROR:",
      creditError
    );

    return NextResponse.json(
      {
        error:
          "Failed to deduct credits.",
      },
      {
        status: 500,
      }
    );
  }
}

    // --- Gemini call with retry ---
    let raw: string;

    try {
      const result = await withGeminiRetry(() =>
        model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
        ])
      );
      raw = result.response.text().trim();
    } catch (err: any) {
      console.error("Gemini unavailable after retries:", err.message);
      return NextResponse.json(
        { error: "Image analysis service temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    // --- Clean fenced code blocks defensively ---
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    // --- Parse JSON ---
    let parsed: ImageAnalysisResult;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed. Raw output:", raw);
      return NextResponse.json(
        { error: "Model returned malformed JSON. Please try again." },
        { status: 502 }
      );
    }

    // --- Validate shape ---
    if (
      typeof parsed.score !== "number" ||
      !Array.isArray(parsed.strengths) ||
      !Array.isArray(parsed.warnings) ||
      typeof parsed.platformFit !== "object" ||
      typeof parsed.relevanceScore !== "number" ||
typeof parsed.matchesProduct !== "boolean" ||
typeof parsed.relevanceWarning !== "string"
    ) {
      console.error("Unexpected response shape:", parsed);
      return NextResponse.json(
        { error: "Model returned an unexpected response format." },
        { status: 502 }
      );
    }

    // --- Clamp and normalize ---
    parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));
    parsed.strengths = parsed.strengths.slice(0, 3);
    parsed.warnings = parsed.warnings.slice(0, 3);

    const platforms = ["Amazon", "Instagram", "Flipkart", "Meesho", "Myntra", "Facebook"] as const;
    for (const p of platforms) {
      if (typeof parsed.platformFit[p] === "number") {
        parsed.platformFit[p] = Math.max(0, Math.min(100, Math.round(parsed.platformFit[p])));
      } else {
        parsed.platformFit[p] = 0; // safe default if model omits a platform
      }
    }

    return NextResponse.json({
    result: parsed,

  usedFreeAnalysis:
    hasFreeAnalysis,

 remainingFreeAnalyses:
  hasFreeAnalysis
    ? FREE_IMAGE_ANALYSES_PER_DAY -
      (freeUsed + 1)
    : 0,
});

  } catch (err) {
    console.error("Unhandled error in /api/analyze-image:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}