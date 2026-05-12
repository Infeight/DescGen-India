// lib/prompts.ts
import { PLATFORM_RULES } from "./platforms";

export interface PromptData {
  productName: string;
  features:    string;
  platform:    string;
  tone:        string;
  language:    string;
}

// Single source of truth — imported by gemini.ts
export interface PersonalizationData {
  brand_name?:      string;
  brand_tone?:      string;
  target_audience?: string;
  writing_style?:   string;
  preferred_cta?:   string;
  platform_tones?:  Record<string, string>;
}

export type VariantKey = "v1" | "v2" | "v3";

export const SYSTEM_INSTRUCTION = `
You are an expert Indian e-commerce copywriter with deep knowledge of 
Meesho, Flipkart, Amazon India, Myntra, and Instagram seller best practices.
You understand Indian shopping culture, regional buyer behaviour (Tier-1, Tier-2, Tier-3),
festive buying patterns, and each platform's ranking algorithm and listing policies.
You write descriptions that convert browsers into buyers.
Always respond with valid JSON only. No markdown, no backticks, no explanation.
`.trim();

const VARIANT_INSTRUCTIONS: Record<VariantKey, string> = {
  v1: "Emotional/festive appeal — connect with feelings, occasion, gifting",
  v2: "Feature-focused — highlight quality, material, specs, value for money",
  v3: "Short punchy version — under 150 characters, mobile-first, high impact",
};

export function buildPrompt(
  data: PromptData,
  onlyVariant?: VariantKey,
  personalization?: PersonalizationData
): string {
  const rules = PLATFORM_RULES[data.platform];
  if (!rules) throw new Error(`Unsupported platform: ${data.platform}`);

  const platformTone = personalization?.platform_tones?.[data.platform];
const effectiveStyle = platformTone || personalization?.writing_style;

// Update personalizationBlock to use effectiveStyle:
const hasBrandMemory = personalization && (
  personalization.brand_name ||
  personalization.brand_tone ||
  personalization.target_audience ||
  effectiveStyle ||                    // ← changed
  personalization.preferred_cta
);

const personalizationBlock = hasBrandMemory ? `
BRAND MEMORY (seller-defined — apply strictly to all descriptions):
${personalization?.brand_name      ? `- Brand name: ${personalization.brand_name}` : ""}
${personalization?.brand_tone      ? `- Brand tone: ${personalization.brand_tone}` : ""}
${personalization?.target_audience ? `- Target audience: ${personalization.target_audience}` : ""}
${effectiveStyle                   ? `- Writing style for ${data.platform}: ${effectiveStyle}` : ""}
${personalization?.preferred_cta   ? `- End every description with this exact CTA: "${personalization.preferred_cta}"` : ""}
These override all generic tone instructions above.
`.trim() : "";

  const variantBlock = onlyVariant
    ? `Generate ONLY variant ${onlyVariant}.
- ${onlyVariant} format: ${rules[`${onlyVariant}Format` as keyof typeof rules]}
- ${onlyVariant} description: ${VARIANT_INSTRUCTIONS[onlyVariant]}
Return ONLY this JSON: {"${onlyVariant}": "..."}`
    : `DESCRIPTION FORMATS (follow exactly per variant):
- v1 format: ${rules.v1Format}
- v2 format: ${rules.v2Format}
- v3 format: ${rules.v3Format}
Return ONLY this JSON: {"v1": "...", "v2": "...", "v3": "..."}`;

  return `
Generate product description(s) for listing on ${data.platform}.

PRODUCT DETAILS:
- Name: ${data.productName}
- Key Features: ${data.features}
- Tone: ${data.tone}
- Output Language: ${data.language}

PLATFORM: ${data.platform.toUpperCase()}
- Character limit: ${rules.charLimit} characters MAX per description (hard limit)
- SEO focus: ${rules.seoKeywords}

${variantBlock}

${personalizationBlock ? personalizationBlock + "\n" : ""}
MANDATORY RULES FOR ${data.platform.toUpperCase()}:
${rules.strictRules.map((r, i) => `${i + 1}. ${r}`).join("\n")}

THINGS TO NEVER DO ON ${data.platform.toUpperCase()}:
${rules.avoid.map((a) => `- Never: ${a}`).join("\n")}

UNIVERSAL RULES (all platforms):
- Use EVERY feature listed — expand each into a selling point, do not skip any
- Infer logical attributes (e.g. "soft cotton" → also breathable, skin-friendly, sweat-absorbent)
- Always include pack size, care instructions, and primary use cases
- Use Indian units (metres, kg — never yards or lbs)
- Never translate brand names or size labels
- If language is not English, write the FULL description in ${data.language}
`.trim();
}