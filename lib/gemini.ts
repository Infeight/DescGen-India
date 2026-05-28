// // lib/gemini.ts
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { withGeminiRetry } from "./gemini-retry";
// import {
//   buildPrompt,
//   PromptData,
//   VariantKey,
//   PersonalizationData,  
//   GenerationResult 
// } from "./prompt";       

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// const model = genAI.getGenerativeModel({
//   model: "gemini-2.5-flash-lite",
//   generationConfig: {
//     responseMimeType: "application/json",
//     temperature: 0.8,
//   },
// });

// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// export async function generateDescriptions(
//   data: PromptData,
//   onlyVariant?: VariantKey,
//   personalization?: PersonalizationData
// ): Promise<GenerationResult> {

//   try {
//   console.log(
//     "CALLING GEMINI API...",
//     onlyVariant
//       ? `variant: ${onlyVariant}`
//       : "all variants"
//   );

//   console.log(
//     "PERSONALIZATION:",
//     personalization
//   );

//   const result =
//     await withGeminiRetry(
//       () =>
//         model.generateContent(
//           buildPrompt(
//             data,
//             onlyVariant,
//             personalization
//           )
//         )
//     );

//   const text =
//     result.response.text();

//   const cleaned = text
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

//   return JSON.parse(cleaned);
// } catch (error) {
//   console.error(
//     "GEMINI ERROR:",
//     error
//   );

//   throw new Error(
//     "Gemini API unavailable after retries"
//   );
// }

//   throw new Error("Gemini API unavailable after retries");
// }

// lib/gemini.ts as of 24-05-26 for analysis listing route.
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withGeminiRetry } from "./gemini-retry";
import {
  buildPrompt,
  PromptData,
  VariantKey,
  PersonalizationData,
  GenerationResult,
} from "./prompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.8,
  },
});

export async function generateDescriptions(
  data: PromptData,
  onlyVariant?: VariantKey,
  personalization?: PersonalizationData
): Promise<GenerationResult> {
  if (process.env.NODE_ENV !== "production") {
    console.log(
      "CALLING GEMINI API...",
      onlyVariant ? `variant: ${onlyVariant}` : "all variants"
    );
    console.log("PERSONALIZATION:", personalization);
  }

  let raw: string;

  try {
    const result = await withGeminiRetry(() =>
      model.generateContent(buildPrompt(data, onlyVariant, personalization))
    );

    raw = result.response.text().trim();
  } catch (error) {
    console.error("GEMINI ERROR:", error);
    throw new Error("Gemini API unavailable after retries");
  }

  // Clean up fenced code blocks defensively
  // (responseMimeType: application/json usually prevents this, but just in case)
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: GenerationResult;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("JSON parse failed. Raw Gemini output:", raw);
    throw new Error("Gemini returned malformed JSON. Please try again.");
  }

  // Basic shape validation before returning to the caller
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    console.error("Unexpected GenerationResult shape:", parsed);
    throw new Error("Gemini returned an unexpected response format.");
  }

  return parsed;
}