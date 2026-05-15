// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  buildPrompt,
  PromptData,
  VariantKey,
  PersonalizationData,  
  GenerationResult 
} from "./prompt";       

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.8,
  },
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateDescriptions(
  data: PromptData,
  onlyVariant?: VariantKey,
  personalization?: PersonalizationData
): Promise<GenerationResult> {
  let retries = 3;

  while (retries > 0) {
    try {
      console.log(
        "CALLING GEMINI API...",
        onlyVariant ? `variant: ${onlyVariant}` : "all variants"
      );
      console.log("PERSONALIZATION:", personalization);

      const result = await model.generateContent(
        buildPrompt(data, onlyVariant, personalization)
      );

      const text    = result.response.text();
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();

      return JSON.parse(cleaned) as {
  v1?: string;
  v2?: string;
  v3?: string;

  hsn_code?: string;

  hsn_description?: string;

  category_path?: string;

  platform_category?: string;
};

    } catch (error: any) {
      console.error("GEMINI ERROR:", error);

      if (error?.status === 503 || error?.status === 429) {
        retries--;
        console.log(`Retrying... attempts left: ${retries}`);
        await sleep(2000);
        continue;
      }

      throw error;
    }
  }

  throw new Error("Gemini API unavailable after retries");
}