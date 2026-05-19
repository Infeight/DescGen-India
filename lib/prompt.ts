
// // lib/prompts.ts
// import { PLATFORM_RULES } from "./platforms";

// export interface PromptData {
//   productName: string;
//   features:    string;
//   platform:    string;
//   tone:        string;
//   language:    string;
//    price?:      string; 
// }

// export interface PersonalizationData {
//   brand_name?:      string;
//   brand_tone?:      string;
//   target_audience?: string;
//   writing_style?:   string;
//   preferred_cta?:   string;
//   platform_tones?:  Record<string, string>;
// }

// // Full generation response shape
// export interface GenerationResult {
//   v1?: string;
//   v2?: string;
//   v3?: string;
//   hsn_code?:         string;
//   hsn_description?:  string;
//   category_path?:    string;
//   platform_category?:string;
// }

// export type VariantKey = "v1" | "v2" | "v3";

// export const SYSTEM_INSTRUCTION = `
// You are an expert Indian e-commerce copywriter and GST/product classification specialist
// with deep knowledge of Meesho, Flipkart, Amazon India, Myntra, and Instagram seller best practices.
// You understand Indian shopping culture, regional buyer behaviour (Tier-1, Tier-2, Tier-3),
// festive buying patterns, platform ranking algorithms, and Indian GST HSN code classification.
// You write descriptions that convert browsers into buyers.
// Always respond with valid JSON only. No markdown, no backticks, no explanation.
// `.trim();

// const VARIANT_INSTRUCTIONS: Record<VariantKey, string> = {
//   v1: "Emotional/festive appeal — connect with feelings, occasion, gifting",
//   v2: "Feature-focused — highlight quality, material, specs, value for money",
//   v3: "Short punchy version — under 150 characters, mobile-first, high impact",
// };

// export function buildPrompt(
//   data: PromptData,
//   onlyVariant?: VariantKey,
//   personalization?: PersonalizationData
// ): string {
//   const rules = PLATFORM_RULES[data.platform];
//   if (!rules) throw new Error(`Unsupported platform: ${data.platform}`);

//   // ── Personalization block ──────────────────────────────────────
//   const platformTone  = personalization?.platform_tones?.[data.platform];
//   const effectiveStyle = platformTone || personalization?.writing_style;

//   const hasBrandMemory = personalization && (
//     personalization.brand_name ||
//     personalization.brand_tone ||
//     personalization.target_audience ||
//     effectiveStyle ||
//     personalization.preferred_cta
//   );

//   const personalizationBlock = hasBrandMemory ? `
// BRAND MEMORY (seller-defined — apply strictly to all descriptions):
// ${personalization?.brand_name      ? `- Brand name: ${personalization.brand_name}` : ""}
// ${personalization?.brand_tone      ? `- Brand tone: ${personalization.brand_tone}` : ""}
// ${personalization?.target_audience ? `- Target audience: ${personalization.target_audience}` : ""}
// ${effectiveStyle                   ? `- Writing style for ${data.platform}: ${effectiveStyle}` : ""}
// ${personalization?.preferred_cta   ? `- End every description with this exact CTA: "${personalization.preferred_cta}"` : ""}
// ${data.price ? `- Price: ${data.price} (include this in the description)` : ""}
// These override all generic tone instructions above.
// `.trim() : "";

//   // ── Variant block ──────────────────────────────────────────────
//   // Single variant regenerate — no HSN needed, just the one variant
//   const variantBlock = onlyVariant
//     ? `Generate ONLY variant ${onlyVariant}.
// - Format: ${rules[`${onlyVariant}Format` as keyof typeof rules]}
// - Style: ${VARIANT_INSTRUCTIONS[onlyVariant]}
// Return ONLY this JSON: {"${onlyVariant}": "..."}`

//     // Full generation — all 3 variants + HSN + category
//     : `DESCRIPTION FORMATS (follow exactly):
// - v1 format: ${rules.v1Format}
// - v2 format: ${rules.v2Format}
// - v3 format: ${rules.v3Format}

// LISTING HELPER (fill these accurately based on the product):
// - hsn_code: the most accurate 8-digit HSN code under Indian GST for this product
// - hsn_description: the official GST description for that HSN code
// - category_path: full category path used on ${data.platform} (e.g. "Clothing > Women > Ethnic Wear > Kurtis")
// - platform_category: the exact leaf-level category name on ${data.platform}

// Return ONLY this JSON (no extra text, no markdown):
// {
//   "v1": "...",
//   "v2": "...",
//   "v3": "...",
//   "hsn_code": "...",
//   "hsn_description": "...",
//   "category_path": "...",
//   "platform_category": "..."
// }`;

//   return `
// Generate product description(s) for listing on ${data.platform}.

// PRODUCT DETAILS:
// - Name: ${data.productName}
// - Key Features: ${data.features}
// - Tone: ${data.tone}
// - Output Language: ${data.language}

// PLATFORM: ${data.platform.toUpperCase()}
// - Character limit: ${rules.charLimit} characters MAX per description (hard limit)
// - SEO focus: ${rules.seoKeywords}

// ${variantBlock}

// ${personalizationBlock ? personalizationBlock + "\n" : ""}
// MANDATORY RULES FOR ${data.platform.toUpperCase()}:
// ${rules.strictRules.map((r, i) => `${i + 1}. ${r}`).join("\n")}

// THINGS TO NEVER DO ON ${data.platform.toUpperCase()}:
// ${rules.avoid.map((a) => `- Never: ${a}`).join("\n")}

// UNIVERSAL RULES (all platforms):
// - Follow ALL platform-specific formatting rules strictly
// - Use EVERY feature listed — expand each into a selling point, do not skip any
// - Infer logical attributes (e.g. "soft cotton" → also breathable, skin-friendly, sweat-absorbent)
// - Always include pack size, care instructions, and primary use cases
// - Use Indian units (metres, kg — never yards or lbs)
// - Never translate brand names or size labels
// - If language is not English, write the FULL description in ${data.language}
// - For HSN code: be accurate — Indian sellers use this for GST filing, errors cause compliance issues
// `.trim();
// }

// ###################################
// prompt.ts with whatapp and facebook added as platforms, and price included in personalization data.
// ###################################

import { PLATFORM_RULES } from "./platforms";

export interface PromptData {
  productName: string;
  features:    string;
  platform:    string;
  tone:        string;
  language:    string;
  price?:      string;
}

export interface PersonalizationData {
  brand_name?:      string;
  brand_tone?:      string;
  target_audience?: string;
  writing_style?:   string;
  preferred_cta?:   string;
  platform_tones?:  Record<string, string>;
}

export interface GenerationResult {
  v1?: string;
  v2?: string;
  v3?: string;
  hsn_code?:          string;
  hsn_description?:   string;
  category_path?:     string;
  platform_category?: string;
}

export type VariantKey = "v1" | "v2" | "v3";

export const SYSTEM_INSTRUCTION = `
You are an expert Indian e-commerce copywriter and GST/product classification specialist
with deep knowledge of Meesho, Flipkart, Amazon India, Myntra, Instagram, Facebook and
WhatsApp seller best practices. You understand Indian shopping culture, regional buyer
behaviour (Tier-1, Tier-2, Tier-3), festive buying patterns, platform ranking algorithms,
and Indian GST HSN code classification.
You write descriptions that convert browsers into buyers.
Always respond with valid JSON only. No markdown, no backticks, no explanation.
`.trim();

const VARIANT_INSTRUCTIONS: Record<VariantKey, string> = {
  v1: "Emotional/festive appeal — connect with feelings, occasion, gifting",
  v2: "Feature-focused — highlight quality, material, specs, value for money",
  v3: "Short punchy version — under 150 characters, mobile-first, high impact",
};

// Platforms that are real marketplaces with GST/category requirements
const MARKETPLACE_PLATFORMS = ["Meesho", "Flipkart", "Amazon", "Myntra"];

export function buildPrompt(
  data: PromptData,
  onlyVariant?: VariantKey,
  personalization?: PersonalizationData
): string {
  const rules = PLATFORM_RULES[data.platform];
  if (!rules) throw new Error(`Unsupported platform: ${data.platform}`);

   console.log("PROMPT DATA RECEIVED:", data); // ← add this line
  console.log("PRICE VALUE:", data.price);   

  // Whether to include HSN + category fields
  const isMarketplace = MARKETPLACE_PLATFORMS.includes(data.platform);

  // ── Personalization block ──────────────────────────────────────
  const platformTone   = personalization?.platform_tones?.[data.platform];
  const effectiveStyle = platformTone || personalization?.writing_style;

  const hasBrandMemory = personalization && (
    personalization.brand_name ||
    personalization.brand_tone ||
    personalization.target_audience ||
    effectiveStyle ||
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

  // ── Variant block ──────────────────────────────────────────────
  const variantBlock = onlyVariant
    // Single variant regenerate — no HSN, just the one variant
    ? `Generate ONLY variant ${onlyVariant}.
- Format: ${rules[`${onlyVariant}Format` as keyof typeof rules]}
- Style: ${VARIANT_INSTRUCTIONS[onlyVariant]}
Return ONLY this JSON: {"${onlyVariant}": "..."}`

    // Full generation
    : `DESCRIPTION FORMATS (follow exactly):
- v1 format: ${rules.v1Format}
- v2 format: ${rules.v2Format}
- v3 format: ${rules.v3Format}

${isMarketplace ? `LISTING HELPER (fill accurately — used for GST compliance):
- hsn_code: most accurate 8-digit HSN code under Indian GST for this product
- hsn_description: official GST description for that HSN code
- category_path: full category path on ${data.platform} (e.g. "Clothing > Women > Ethnic Wear > Kurtis")
- platform_category: exact leaf-level category name on ${data.platform}

Return ONLY this JSON:
{
  "v1": "...",
  "v2": "...",
  "v3": "...",
  "hsn_code": "...",
  "hsn_description": "...",
  "category_path": "...",
  "platform_category": "..."
}` : `Return ONLY this JSON:
{
  "v1": "...",
  "v2": "...",
  "v3": "..."
}`}`;

  return `
Generate product description(s) for listing on ${data.platform}.

PRODUCT DETAILS:
- Name: ${data.productName}
- Key Features: ${data.features}
- Tone: ${data.tone}
- Output Language: ${data.language}
${data.price ? `- SELLER PRICE: ${data.price} — USE THIS EXACT PRICE. Do not change, round, or replace it under any circumstances.` : ""}

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
- Follow ALL platform-specific formatting rules strictly
- Use EVERY feature listed — expand each into a selling point, do not skip any
- Infer logical attributes (e.g. "soft cotton" → also breathable, skin-friendly, sweat-absorbent)
- Always include pack size, care instructions, and primary use cases
- Use Indian units (metres, kg — never yards or lbs)
- Never translate brand names or size labels
- If language is not English, write the FULL description in ${data.language}
${data.price ? `- PRICE RULE: The price is ${data.price}. Write exactly this price. Never invent or change the price.` : ""}
${isMarketplace ? `- HSN code accuracy is critical — sellers use this for GST filing` : ""}
`.trim();
}