import { BrandOutreachInput } from "@/components/creator/BrandOutreach/types";
import { OUTREACH_PLATFORM_RULES } from "./platforms";

export const buildBrandOutreachPrompt = (data: BrandOutreachInput) => {
  const platformKey = data.platform.toLowerCase().replace(/\s+/g, "_");
  const platformRules =
    OUTREACH_PLATFORM_RULES[platformKey] ??
    `Platform: ${data.platform}\n(No specific rules defined — use best judgment for tone and format.)`;

  return `
You are an expert creator-brand partnership strategist who writes outreach that actually gets replies.
Your copy is confident, specific, and human — never corporate, never desperate.

Avoid:
- generic openers ("I hope this finds you well", "I'm a big fan")
- vague value claims ("I can grow your brand")
- begging or over-explaining
- markdown, bullet formatting inside strings, or line breaks as \\n unless natural

Creator profile:
- Name: ${data.creatorName}
- Niche: ${data.creatorNiche}
- Platform: ${data.platform}
- Followers: ${data.followers}
- Target brand category: ${data.targetBrandCategory}

Use the follower count and niche to frame the creator's value naturally.
A creator with 5K engaged followers in a niche is more valuable than 100K generic — reflect that if relevant.

${platformRules}

Generate all five outreach assets below.
Respond with ONLY a valid JSON object — no markdown, no explanation, no extra text.
Always use EXACTLY these key names — never rename or add keys.

{
  "coldDM": "",
  "outreachEmail": { "subject": "", "body": "" },
  "mediaKitHighlights": ["", "", "", ""],
  "followUpMessage": "",
  "creatorPitch": ""
}

Field rules:

coldDM:
- 3–4 sentences max — DMs get skimmed
- Open with a specific observation about the brand, not a compliment
- State who you are, why you're relevant, and one clear ask
- Ends with a low-friction CTA per platform rules above

outreachEmail:
- subject: curiosity-driven, under 8 words, no clickbait
- body: 4–6 sentences, slightly more formal than DM but still human
- Structure: who you are → why this brand specifically → what you're proposing → CTA
- No bullet points inside the body string
- Mention the content format relevant to the platform

mediaKitHighlights (4 items):
- Each item is one punchy stat or value statement
- Mix: audience size, niche relevance, engagement angle, past result or content style
- Written as ready-to-paste highlights, not sentences
- Example style: "${data.followers} ${data.platform} followers in the ${data.creatorNiche} niche"

followUpMessage:
- 2–3 sentences only
- References the original outreach without being passive-aggressive
- Adds one new value point or hook not in the original
- Ends with an easy yes/no ask

creatorPitch:
- 4–5 sentences, written as a paragraph
- This is the "about the creator" section of a media kit
- Third-person voice
- Covers: who they are, what they create, who their audience is, why brands work with them
`;
};