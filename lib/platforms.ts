// lib/platforms.ts
export interface PlatformRule {
  charLimit: number;
  v1Format: string;
  v2Format: string;
  v3Format: string;
  seoKeywords: string;
  strictRules: string[];
  avoid: string[];
}

export const PLATFORM_RULES: Record<string, PlatformRule> = {
  Meesho: {
    charLimit: 500,
    v1Format: "warm conversational paragraph, no bullets, no ALL CAPS, festive/emotional tone",
    v2Format: "3-4 short bullet points starting with feature name, factual and clear",
    v3Format: "single punchy sentence under 120 chars, mobile-first",
    seoKeywords: "include fabric type, occasion (casual/festive/daily), size range (S-3XL), and care method",
    strictRules: [
      "No ALL CAPS anywhere — Meesho rejects listings with all-caps",
      "No exaggerated claims like 'best in world' or 'guaranteed'",
      "Mention material, size range, and wash care",
      "Keep each description under 500 characters strictly",
      "Use simple Hindi-friendly English words (buyers are Tier-2/3 cities)",
    ],
    avoid: ["ALL CAPS", "exaggerated superlatives", "price mentions", "competitor names"],
  },

  Flipkart: {
    charLimit: 2000,
    v1Format: "3-5 bullet points, each starting with a bold feature keyword followed by colon and detail",
    v2Format: "short paragraph covering material, use case, and value, followed by 3 spec bullets",
    v3Format: "3 tight bullet points only, under 300 chars total, most important features first",
    seoKeywords: "include brand (if any), material, product type, gender, occasion, size range, pack count, wash care",
    strictRules: [
      "Start with product type + brand/material in the first bullet",
      "Include pack size (e.g. Pack of 1)",
      "Mention country of origin if known",
      "Include warranty or guarantee if applicable",
      "Use simple structured language — no storytelling, Flipkart buyers are feature-scanners",
    ],
    avoid: ["vague claims without specifics", "long paragraphs without bullets", "symbols or special characters"],
  },

  Amazon: {
    charLimit: 2000,
    v1Format: "5 bullet points, each opening with ALL CAPS keyword followed by colon then detail sentence",
    v2Format: "paragraph hook (2 sentences) followed by 5 ALL CAPS bullet points covering features",
    v3Format: "5 ultra-tight ALL CAPS bullets, one line each, pure keywords + value, under 400 chars total",
    seoKeywords: "include search terms: 'women ethnic wear', 'kurta for women', size range, fabric, occasion, pack size, care instructions",
    strictRules: [
      "Bullet openers MUST be ALL CAPS keyword (e.g. PURE COTTON:, PACK OF 1:)",
      "Include pack size in every description",
      "Mention size range (S to 3XL) — high-search phrase on Amazon",
      "Include care instructions (machine wash, hand wash etc.)",
      "Use both 'kurti' and 'kurta' spellings for SEO coverage",
      "Include use cases: daily wear, office, festive, casual",
    ],
    avoid: ["seller contact info", "website URLs", "price or discount mentions", "shipping promises"],
  },

  Myntra: {
    charLimit: 1000,
    v1Format: "fashion-forward narrative paragraph, style-focused, mention occasion and outfit pairing tips",
    v2Format: "style description paragraph followed by 3-4 attribute bullets (fabric, fit, occasion, care)",
    v3Format: "single confident style statement under 150 chars, fashion-first language",
    seoKeywords: "include: style category (A-line, straight, anarkali), fabric, fit type, occasion (festive/casual/workwear), season",
    strictRules: [
      "Myntra is fashion-forward — use style terminology (silhouette, drape, fit, palette)",
      "Titles must combine: category + style + fabric + fit + occasion",
      "Mention size and fit accuracy — reduces return rate (Myntra penalises >15% returns)",
      "Include styling tips ('pair with palazzos', 'wear with juttis')",
      "Brand name must appear — Myntra does not allow unbranded listings",
    ],
    avoid: ["generic non-fashion language", "price mentions", "misleading fit descriptions", "unbranded product claims"],
  },

  Instagram: {
    charLimit: 2200,
    v1Format: "story-style caption: strong hook in first 125 chars (shows before 'more'), then story, then CTA, then 3-5 niche hashtags at end",
    v2Format: "problem-solution caption: open with a pain point, present product as solution, end with CTA + 3-5 hashtags",
    v3Format: "ultra-short punchy caption under 125 chars with 1-2 emojis and 3 hashtags — entire caption visible without clicking 'more'",
    seoKeywords: "use keyword-rich natural sentences (Instagram now uses semantic search), include 3-5 niche hashtags not generic ones",
    strictRules: [
      "First 125 characters are critical — this is all buyers see before 'more' in feed",
      "Use 3-5 hashtags only — Instagram penalises spam hashtag stuffing (not 20-30)",
      "Use niche hashtags over generic ones (#CottonKurti over #Fashion)",
      "End every caption with a CTA: 'Link in bio', 'DM to order', 'Comment SIZE to buy'",
      "Every Instagram caption MUST include at least 1-3 relevant emojis naturally inside the caption",
      "Write keyword-rich sentences naturally — Instagram uses semantic search not just hashtags",
      "Hashtags count toward 2200 char limit — budget accordingly",
      "Every Instagram variant MUST end with exactly 3-5 niche hashtags on a new line (e.g. #CottonKurti #WomenEthnicWear #SummerFashionIndia). Never skip hashtags.",
    ],
    avoid: ["30 generic hashtags", "price in caption (DM for price works better)", "long hashtag blocks that bury the CTA", "all-emoji captions"],
  },

  Facebook: {
  charLimit: 1500,
  v1Format: "friendly conversational paragraph, warm tone, mention key features naturally, end with message CTA",
  v2Format: "short punchy paragraph followed by 3-4 feature bullets with emojis, end with comment CTA",
  v3Format: "2-3 sentences max under 200 chars, emoji opener, price if known, CTA at end",
  seoKeywords: "include product type, material, occasion, size range, condition (new), location if relevant",
  strictRules: [
    "Use warm conversational language — Facebook buyers expect friendly sellers not corporate copy",
    "End every description with a clear CTA: 'Message to order', 'Comment below', or 'DM for price'",
    "Include size range and material — top questions buyers ask before messaging",
    "1-2 emojis per paragraph maximum — enough to stand out, not enough to look spammy",
    "Keep under 1500 characters — Facebook truncates longer posts in feed",
    "Always end with a clear CTA on its own line: 'Comment PRICE below', 'Message us to order', or 'DM for availability'",
  ],
  avoid: [
    "Formal corporate language",
    "ALL CAPS sentences",
    "More than 5 emojis total",
    "Fake urgency like 'offer ends tonight' without basis",
    "Asking buyers to call — always DM or comment",
  ],
},

WhatsApp: {
  charLimit: 700,
  v1Format: "emoji opener line, 2-3 key features as short lines, price on its own line, stock urgency line, DM CTA at end",
  v2Format: "product name bold with emoji, feature list with checkmark emojis, price, sizes, DM CTA",
  v3Format: "ultra short - product + price + one selling point + DM CTA, under 150 chars, 1-2 emojis only",
  seoKeywords: "price, size range, material, occasion, delivery info if applicable",
  strictRules: [
    "Always include price — WhatsApp buyers expect to see price in the caption",
    "Keep it scannable — buyers read on small screens while scrolling",
    "End with DM CTA every time: 'DM to order', 'Message ORDER to buy', 'Reply to book'",
    "Use line breaks between each point — wall of text gets ignored on WhatsApp",
    "2-4 emojis total — WhatsApp style is casual but not cluttered",
    "Include sizes if apparel — 'Sizes S-3XL available' reduces back-and-forth messages",
    "Never add urgency claims like 'limited stock' or 'offer ends soon' unless the seller explicitly mentioned it in their features",
  ],
  avoid: [
    "Long paragraphs — WhatsApp is scanned not read",
    "No price — biggest reason sellers get zero replies",
    "Formal language — WhatsApp is personal and casual",
    "Website links — most WhatsApp sellers don't have one",
    "More than 5 emojis",
  ],
},
};