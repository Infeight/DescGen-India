// app/api/analyze/route.ts

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withGeminiRetry } from "@/lib/gemini-retry"; // ← matches your actual export

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.3,
  },
});

interface VariantAnalysis {
  score: number;
  strengths: string[];
  warnings: string[];
}

interface AnalysisResponse {
  v1: VariantAnalysis;
  v2: VariantAnalysis;
  v3: VariantAnalysis;
}

const FALLBACK_RESPONSE = {
  fallback: true,
  v1: { score: 0, strengths: [], warnings: ["AI analysis temporarily unavailable. Please try again in a moment."] },
  v2: { score: 0, strengths: [], warnings: ["AI analysis temporarily unavailable. Please try again in a moment."] },
  v3: { score: 0, strengths: [], warnings: ["AI analysis temporarily unavailable. Please try again in a moment."] },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { platform, variants } = body;

    // --- Input validation ---
    if (!platform || typeof platform !== "string" || platform.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'platform' field." },
        { status: 400 }
      );
    }

    if (!variants || typeof variants !== "object" || Array.isArray(variants)) {
      return NextResponse.json(
        { error: "Missing or invalid 'variants' object." },
        { status: 400 }
      );
    }

    const { v1, v2, v3 } = variants;

    if (!v1 || !v2 || !v3) {
      return NextResponse.json(
        { error: "All three variants (v1, v2, v3) are required." },
        { status: 400 }
      );
    }

    if (typeof v1 !== "string" || typeof v2 !== "string" || typeof v3 !== "string") {
      return NextResponse.json(
        { error: "Each variant must be a string." },
        { status: 400 }
      );
    }

    const normalizedPlatform = platform.trim();
    const isSocialPlatform = /instagram|tiktok|pinterest/i.test(normalizedPlatform);

    const prompt = `
You are a senior ecommerce listing optimization expert with deep knowledge of ${normalizedPlatform}'s algorithm, buyer psychology, and platform-specific best practices.

Analyze ALL THREE listing variants separately and return a JSON object. Be direct, specific, and brutally honest.

EVALUATION CRITERIA (weigh equally):
1. SEO & discoverability — keywords, title structure, searchability
2. Readability — clarity, scannability, grammar, sentence length
3. CTA effectiveness — urgency, action-oriented language, conversion hooks
4. Engagement potential — emotional appeal, storytelling, trust signals
5. Platform fit — tone, formatting, conventions specific to ${normalizedPlatform}
6. Formatting quality — use of spacing, bullets, caps, emojis (if appropriate)
${isSocialPlatform ? "7. Hashtag strategy — relevance, volume balance, niche vs broad tags" : ""}

SCORING GUIDE:
- 85–100: Exceptional. Near-perfect for ${normalizedPlatform}.
- 70–84: Good. Solid foundation with a few clear gaps.
- 55–69: Average. Works but leaves significant conversion on the table.
- 40–54: Weak. Major structural or strategic issues.
- 0–39: Poor. Fundamental problems across most criteria.

OUTPUT FORMAT (return ONLY this JSON, no markdown, no explanation):
{
  "v1": { "score": <integer 0–100>, "strengths": ["...", "...", "..."], "warnings": ["...", "...", "..."] },
  "v2": { "score": <integer 0–100>, "strengths": ["...", "...", "..."], "warnings": ["...", "...", "..."] },
  "v3": { "score": <integer 0–100>, "strengths": ["...", "...", "..."], "warnings": ["...", "...", "..."] }
}

RULES:
- Maximum 3 strengths, maximum 3 warnings per variant
- Never say "good use of keywords" — name the specific keyword and why it works
- Never say "consider adding more detail" — say exactly what detail is missing and where
- If a variant is fewer than 20 words, set its score to 30 and warn it is too short to evaluate
- All feedback must be actionable and ${normalizedPlatform}-specific
- Scores across variants should reflect genuine relative differences — do not cluster them artificially

VARIANT 1:
${v1}

VARIANT 2:
${v2}

VARIANT 3:
${v3}
`;

    // --- Gemini call with retry ---
    let raw: string;

    try {
      const result = await withGeminiRetry(() => model.generateContent(prompt));
      raw = result.response.text().trim();
    } catch (err: any) {
      console.error("Gemini unavailable after retries:", err.message);
      return NextResponse.json(FALLBACK_RESPONSE, { status: 200 });
    }

    // --- Clean fenced code blocks defensively ---
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    // --- Parse JSON ---
    let parsed: AnalysisResponse;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed. Raw output:", raw);
      return NextResponse.json(
        { error: "Model returned malformed JSON. Please try again." },
        { status: 502 }
      );
    }

    // --- Validate and clamp each variant ---
    for (const key of ["v1", "v2", "v3"] as const) {
      const variant = parsed[key];

      if (
        !variant ||
        typeof variant !== "object" ||
        typeof variant.score !== "number" ||
        !Array.isArray(variant.strengths) ||
        !Array.isArray(variant.warnings)
      ) {
        console.error(`Unexpected shape for variant ${key}:`, variant);
        return NextResponse.json(
          { error: `Model returned invalid data for variant ${key}.` },
          { status: 502 }
        );
      }

      // Clamp score to 0–100
      parsed[key].score = Math.max(0, Math.min(100, Math.round(variant.score)));

      // Enforce max 3 items each (model sometimes ignores this)
      parsed[key].strengths = variant.strengths.slice(0, 3);
      parsed[key].warnings = variant.warnings.slice(0, 3);
    }

    console.log("Analysis result:", parsed);

    return NextResponse.json(parsed);

  } catch (err) {
    console.error("Unhandled error in /api/analyze:", err);
    return NextResponse.json(FALLBACK_RESPONSE, { status: 200 });
  }
}