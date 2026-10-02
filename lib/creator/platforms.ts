export const PLATFORM_RULES: Record<string, string> = {
  instagram_reels: `
Platform: Instagram Reels

hooks (3 items):
- Under 8 words — Reels viewers scroll fast
- Text overlay friendly — first line works as on-screen caption
- Trend-aware, sound-on assumed

shotPlan (5 items):
- Shot 1 (Hook): Talking head or dramatic product reveal — first 2 seconds matter
- Shot 2 (Context): Show your space/setup — lifestyle context builds trust
- Shot 3 (Detail): Extreme close-up of key product feature
- Shot 4 (In-use): Authentic use moment, natural lighting, no tripod required
- Shot 5 (CTA): Face-to-camera soft ask or text overlay CTA

caption:
- 3–5 sentences, first-person creator voice
- First line must hook before "more" cutoff
- Ends with a soft question to drive comments

hashtags (5–8 items):
- Mix: 2 niche tags, 2 mid-size (100k–1M), 1–2 broad
- No spam tags

storyIdeas (4 items):
- Story 1: Teaser poll ("would you try this?")
- Story 2: Pain point with emoji reactions
- Story 3: Product in action with swipe-up or link sticker
- Story 4: Reply/DM engagement ("comment X to get the link")

cta:
- Soft: "link in bio", "save this", "DM me [keyword]"
`,

  youtube_shorts: `
Platform: YouTube Shorts

hooks (3 items):
- Under 6 words — retention drops in first 0.5s
- Verbal hook only — no text overlays needed
- Must create a "watch to the end" loop

shotPlan (5 items):
- Shot 1 (Hook): State the payoff immediately ("Here's why I switched to X")
- Shot 2 (Problem): Quick visual of the before/problem state
- Shot 3 (Product): Clear product reveal with verbal callout
- Shot 4 (Proof): Demonstrate one concrete result or feature
- Shot 5 (Loop/CTA): End that encourages replay or subscribe nudge

caption:
- 1–2 sentences only — Shorts captions are barely visible
- Focus on keywords for search discoverability
- No hashtag spam

hashtags (3–5 items):
- Keyword-style tags only (#productreview #[niche]tips)
- #Shorts is mandatory
- Avoid Instagram-style niche tags

storyIdeas (4 items) — for YouTube Shorts these are end screen / pinned comment ideas:
- Idea 1: Pinned comment driving to long-form video
- Idea 2: Poll ("which do you prefer?")
- Idea 3: Reply to top comment idea
- Idea 4: Community post teaser

cta:
- "Subscribe for part 2", "Watch till end", "Comment your answer"
- Never "link in bio" — not valid on Shorts
`,

  whatsapp_status: `
Platform: WhatsApp Status

hooks (3 items):
- Under 6 words — status is 15–30s max
- Personal and warm — feels like a message to a friend
- No hype, just genuine

shotPlan (3 items — status is short, 5 shots is too many):
- Shot 1: Quick product show or unboxing moment (5–8s)
- Shot 2: One clear benefit shown visually (5–8s)
- Shot 3: Face-to-camera personal recommendation (5–8s)

caption:
- 1–2 lines max — status text is small
- Conversational, like a WhatsApp message
- Can include a single emoji

hashtags: NOT APPLICABLE for WhatsApp Status. Omit this field entirely.

storyIdeas (3 items) — for WhatsApp Status these are follow-up status ideas:
- Status 1: Curiosity teaser ("I found something...")
- Status 2: Product in use, no words
- Status 3: Soft ask ("Reply if you want the link")

cta:
- "Reply to this status", "DM me", "Check my bio link"
- Keep it personal — no formal marketing CTAs
`,

  whatsapp_community: `
Platform: WhatsApp Community

hooks (3 items):
- Opens like a message, not an ad
- Problem-first framing ("Struggling with X?")
- Builds curiosity without clickbait

shotPlan (3 items):
- Shot 1: Quick product intro, informal tone
- Shot 2: One feature that solves the community's pain point
- Shot 3: Testimonial style — "I've been using this for X days"

caption:
- Write as a community post, not a caption
- 3–5 sentences, informative + personal
- End with a genuine question to spark replies

hashtags: NOT APPLICABLE. Omit entirely.

storyIdeas (3 items) — for WhatsApp Community these are follow-up message ideas:
- Message 1: Intro + product context for the community niche
- Message 2: Value post — tip related to the product
- Message 3: Engagement ask — question or poll

cta:
- "Comment below", "DM admin", "React with 👍 if you want more info"
`,

  facebook: `
Platform: Facebook (Reels / Feed Video)

hooks (3 items):
- Works both with and without sound — sound-off is common on Facebook
- Nostalgia or community-angle performs well
- Can be slightly longer — 10 words max

shotPlan (5 items):
- Shot 1 (Hook): Text overlay + visual — many viewers watch muted
- Shot 2 (Context): Lifestyle setting, family or community feel
- Shot 3 (Feature): Clear product demo, subtitles if talking
- Shot 4 (Social proof): Show reactions, comments, or before/after
- Shot 5 (CTA): Verbal + text CTA for muted viewers

caption:
- 5–8 sentences — Facebook rewards longer captions
- Tell a story, include a personal angle
- End with a question or tag prompt ("Tag someone who needs this")

hashtags (3–5 items):
- Minimal — Facebook hashtags have low impact
- Use only highly relevant ones

storyIdeas (4 items):
- Story 1: Facebook Story teaser with sticker poll
- Story 2: Before/after or problem framing
- Story 3: Product walkthrough with text overlay
- Story 4: "Share if you agree" engagement post

cta:
- "Comment below", "Share with a friend", "Save for later"
- Avoid "link in bio" — use actual post links on Facebook
`,
};