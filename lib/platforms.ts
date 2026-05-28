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
    v1Format: "simple warm Meesho-style description using easy everyday English, practical product clarity, short sentences, and friendly reseller-friendly tone",
    v2Format:  "short practical product description followed by simple feature points covering fabric, fit, usage, sizes, and wash care in easy-to-understand wording",
    v3Format:  "ultra-short mobile-friendly Meesho listing under 120 characters using simple practical wording focused on product clarity",
    seoKeywords:"naturally include practical buyer search terms like fabric, occasion, size range, daily wear, wash care, and comfort without sounding overly optimized",
   strictRules: [
  "Write in simple easy-to-understand English suitable for Tier-2 and Tier-3 buyers",

  "Prioritize clarity and practicality over premium branding language",

  "Use short readable sentences optimized for mobile users",

  "Mention important buyer details clearly: fabric, sizes, occasion, and wash care",

  "Descriptions should feel reseller-friendly and trustworthy",

  "Avoid complicated fashion terminology or advanced English vocabulary",

  "Focus on comfort, usefulness, affordability feel, and everyday wearability",

  "Keep descriptions highly scannable with low reading effort",

  "Avoid sounding like luxury fashion brands or influencer marketing",

  "The tone should feel approachable, practical, and realistic",
],
   avoid: [
  "luxury fashion language",
  "advanced English vocabulary",
  "corporate marketing tone",
  "keyword stuffing",
  "hard-selling urgency",
  "long paragraphs",
  "complex styling language",
  "overly premium wording",
  "influencer-style captions",
],
  },

  Flipkart: {
    charLimit: 2000,
    v1Format: "Flipkart-style structured feature bullets with practical buyer-focused wording, easy mobile readability, and value-oriented clarity",
    v2Format:  "short practical overview paragraph followed by concise structured feature bullets highlighting usability, comfort, specifications, and value",
    v3Format:  "compact Flipkart listing summary under 300 characters using highly scannable practical feature-focused wording",
    seoKeywords: "naturally include high-intent Flipkart buyer terms like material, product type, usage occasion, size range, fit, pack quantity, and care details without sounding keyword-stuffed",
    strictRules: [
  "Write for practical Flipkart buyers comparing multiple similar products",

  "Descriptions should feel structured, readable, and value-focused",

  "Use concise feature-first formatting with easy mobile readability",

  "Focus on usability, comfort, specifications, and practical benefits",

  "Avoid excessive emotional storytelling or influencer-style language",

  "Use simple and highly scannable sentence structures",

  "Highlight important buyer decision factors clearly: fabric, fit, size, pack quantity, and usage",

  "Descriptions should feel trustworthy, practical, and conversion-focused",

  "Avoid overhyping products — clarity builds more trust on Flipkart",

  "Formatting should feel clean and comparison-friendly",
],
    avoid: [
  "luxury fashion tone",
  "influencer-style captions",
  "emotional storytelling",
  "corporate marketing language",
  "keyword stuffing",
  "long unstructured paragraphs",
  "hard-selling urgency",
  "overly decorative formatting",
  "vague product claims",
],
  },

  Amazon: {
    charLimit: 2000,
    v1Format: "Amazon-style structured bullet listing with highly scannable feature-first formatting, keyword-rich phrasing, and practical buyer-focused clarity",
    v2Format:  "short buyer-focused opening paragraph followed by structured ALL CAPS feature bullets emphasizing utility, specifications, sizing, and usage scenarios",
    v3Format: "ultra-compact Amazon bullet summary using high-value searchable feature keywords and practical benefits under 400 characters",
    seoKeywords:  "naturally include high-intent Amazon search phrases like fabric type, product category, size range, use case, fit type, care instructions, and pack quantity without keyword stuffing",
    strictRules: [
  "Write for fast-scanning Amazon shoppers comparing multiple listings",

  "Each bullet must communicate one strong buyer-relevant benefit clearly",

  "Use ALL CAPS feature openers naturally and consistently",

  "Focus on clarity, practicality, specifications, and usability",

  "Descriptions should feel trustworthy, informative, and conversion-focused",

  "Include sizing, fabric, usage occasions, care instructions, and pack details naturally",

  "Avoid emotional storytelling or influencer-style language",

  "Use highly readable sentence structure optimized for mobile shoppers",

  "Keyword integration should feel natural and search-intent aware",

  "Prioritize specificity over hype — concrete details build Amazon trust",
],
    avoid: [
  "emotional storytelling",
  "influencer-style captions",
  "generic marketing phrases",
  "vague claims",
  "social-media tone",
  "emoji-heavy writing",
  "keyword stuffing",
  "hard-selling urgency",
  "overly decorative formatting",
],
  },

  Myntra: {
    charLimit: 1000,
    v1Format: "fashion-forward narrative with aspirational styling language, occasion-based mood, elevated tone, and subtle outfit pairing suggestions that feel premium and editorial",
    v2Format: "premium style-focused paragraph followed by concise fashion attribute bullets covering silhouette, fabric, fit, occasion, and styling recommendations",
    v3Format:  "short confident fashion statement under 150 characters that feels stylish, modern, and boutique-premium instead of promotional",
    seoKeywords: "naturally include fashion-search vocabulary like silhouette, fit, neckline, fabric, occasion, season, and styling aesthetic without sounding keyword-heavy",
   strictRules: [
  "Write like a premium fashion brand or stylist, not a marketplace seller",

  "Use fashion vocabulary naturally: silhouette, drape, fit, palette, texture, neckline, layering, etc.",

  "Descriptions should help buyers imagine styling and wearing the outfit",

  "Maintain an aspirational but elegant tone — never aggressive selling",

  "Mention fit clarity and styling compatibility to reduce return confusion",

  "Include outfit pairing suggestions naturally when relevant",

  "Avoid robotic ecommerce phrasing or technical listing tone",

  "Captions should feel editorial, boutique-premium, and visually expressive",

  "Brand presence should feel premium and fashion-aware",

  "Focus on mood, aesthetic, and styling confidence rather than only features",
],
   avoid: [
  "generic ecommerce wording",
  "technical marketplace language",
  "hard-selling CTA phrases",
  "robotic feature stacking",
  "price-focused language",
  "cheap-sounding descriptions",
  "keyword stuffing",
  "overly basic fashion descriptions",
  "non-fashion vocabulary",
],
  },

  Instagram: {
    charLimit: 2200,
    v1Format: "emotion-first Instagram caption with a scroll-stopping hook in the first 1-2 lines, natural storytelling, emotionally expressive but human tone, relatable phrasing, soft social-media rhythm, subtle CTA, and 3-5 niche hashtags at the end",
    v2Format:  "problem-solution Instagram caption focused on buyer desire, lifestyle transformation, and product benefits while still sounding casual and creator-style instead of corporate",
    v3Format:  "ultra-short Instagram caption under 125 characters that feels trendy, expressive, and instantly readable without sounding forced or promotional",
    seoKeywords:  "write naturally keyword-rich captions using fashion/lifestyle/product vocabulary Instagram users actually search for; prioritize semantic relevance over keyword stuffing",
    strictRules: [
  "The first 125 characters must emotionally hook the viewer before the 'more' cutoff",
  
  "Write like a modern Instagram creator or boutique brand, not a corporate marketing team",

  "Use short and varied sentence lengths for natural social-media rhythm",

  "Avoid robotic CTA phrases like 'Buy now' or 'Shop today'",

  "Use emotionally expressive but minimal emojis naturally — never emoji spam",

  "Make captions feel relatable, aspirational, or aesthetic depending on the product type",

  "Hashtags must be niche and relevant to the actual product category, not generic viral tags",

  "Use conversational phrasing that feels organic in Instagram feeds",

  "Never sound overly optimized, repetitive, or AI-generated",

  "End naturally with subtle engagement prompts like 'DM to order', 'Which color would you pick?', or 'Link in bio ✨'",
],
    avoid: [
  "generic influencer phrases",
  "robotic marketing language",
  "corporate brand tone",
  "overly formal wording",
  "spam hashtags",
  "all-caps hooks",
  "emoji overload",
  "repetitive CTA endings",
  "fake urgency like 'LIMITED STOCK'",
],
  },

  Facebook: {
  charLimit: 1500,
  v1Format: "friendly conversational Facebook selling post with warm human tone, natural product mention, trust-building language, and relaxed social-media pacing",
  v2Format: "casual Facebook marketplace-style post with short engaging introduction followed by easy-to-scan feature lines and soft conversational CTA",
  v3Format: "short social-selling style Facebook caption under 200 characters that feels personal, friendly, and easy to engage with",
  seoKeywords: "naturally mention practical buyer details like material, size range, product condition, usage occasion, and delivery/location context without sounding keyword-optimized",
 strictRules: [
  "Write like a genuine small business owner or trusted seller, not a corporate brand",

  "Use warm, approachable, and conversational wording",

  "Descriptions should feel believable and socially natural inside Facebook feeds",

  "Avoid aggressive selling language or overhyped claims",

  "Use short readable sections for mobile-first Facebook browsing",

  "CTA should feel casual and inviting like 'DM if interested' or 'Message to order ✨'",

  "Use only minimal natural emojis that support the tone",

  "Focus on comfort, practicality, trust, and everyday usability",

  "Posts should feel easy to comment on, share, or message about",

  "Never sound overly optimized, scripted, or AI-generated",
],
  avoid: [
  "corporate marketing tone",
  "formal advertising language",
  "fake urgency",
  "spammy emoji usage",
  "hard-selling CTA phrases",
  "keyword stuffing",
  "luxury-fashion language",
  "overly polished influencer tone",
  "robotic ecommerce formatting",
],
},

WhatsApp: {
  charLimit: 700,
  v1Format:  "warm reseller-style WhatsApp message with a casual conversational tone, short scannable lines, emotional but natural wording, product highlights, pricing, and soft urgency only if seller mentions it",
  v2Format: "WhatsApp selling message with a friendly product intro followed by short feature lines using natural chat-style formatting and a clear DM/reply CTA",
  v3Format:  "ultra-short WhatsApp-forward style message under 150 characters that instantly communicates product, price, and buying intent in a natural chat tone",
  seoKeywords:  "naturally include key buyer questions like price, sizes, fabric, color, delivery availability, and occasion without sounding keyword-stuffed",
 strictRules: [
  "Write like a trusted reseller personally recommending the product in chat",

  "Keep messages highly scannable for small mobile screens",

  "Use short line breaks instead of long paragraphs",

  "Price must feel naturally placed, not aggressively promotional",

  "Use only 2-4 soft emojis maximum and place them naturally",

  "Avoid sounding like formal advertising or ecommerce listings",

  "Include sizes and availability clearly when relevant",

  "CTA must feel conversational like 'DM to order', 'Reply if interested', or 'Message to book'",

  "Avoid fake urgency unless seller explicitly mentions limited stock or offers",

  "Messages should feel easy to forward in WhatsApp groups and statuses",
],
 avoid: [
  "formal brand language",
  "corporate marketing tone",
  "long paragraphs",
  "too many emojis",
  "robotic CTA phrases",
  "website-style formatting",
  "fake urgency",
  "hard-selling language",
  "spammy discount wording",
],
},
};