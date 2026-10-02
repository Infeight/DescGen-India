"use client";

import { toast } from "sonner";

export default function CreatorOutput({ data, platform }: { data: any; platform: string }) {
  if (!data) return null;

  const PLATFORM_LABELS: Record<string, {
  hooks: string;
  shotPlan: string;
  storyIdeas: string;
}> = {
  instagram_reels: {
    hooks: "🎬 Reel Hooks",
    shotPlan: "📸 Shot Plan",
    storyIdeas: "📲 Story Sequence",
  },
  youtube_shorts: {
    hooks: "🎬 Opening Hooks",
    shotPlan: "🎥 Shot Plan",
    storyIdeas: "📌 End Screen & Pinned Comment Ideas",
  },
  whatsapp_status: {
    hooks: "💬 Status Openers",
    shotPlan: "📱 Status Shots",
    storyIdeas: "🔁 Follow-up Status Ideas",
  },
  whatsapp_community: {
    hooks: "💬 Message Openers",
    shotPlan: "📱 Video Shots",
    storyIdeas: "📢 Community Message Ideas",
  },
  facebook: {
    hooks: "🎬 Video Hooks",
    shotPlan: "📸 Shot Plan",
    storyIdeas: "📖 Facebook Story Ideas",
  },
};

const labels = PLATFORM_LABELS[platform] ?? {
  hooks: "🎬 Hooks",
  shotPlan: "📸 Shot Plan",
  storyIdeas: "📲 Story Ideas",
};

  const copyToClipboard = async (
    text: string,
    message: string
  ) => {
    try {
      await navigator.clipboard.writeText(text);

      toast.success(message);
    } catch {
      toast.error("Failed to copy.");
    }
  };

//  fullKit to use labels
const fullKit = `
${labels.hooks}

${data.hooks?.join("\n\n")}

📝 CAPTION

${data.caption}

#️⃣ HASHTAGS

${data.hashtags?.join(" ")}

${labels.shotPlan.toUpperCase()}

${data.shotPlan?.join("\n")}

${labels.storyIdeas.toUpperCase()}

${data.storyIdeas?.join("\n")}

🎯 CTA

${data.cta}
`;

  return (
    <div className="mt-10 space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-white">
          🎥 Creator Kit
        </h2>

        <button
          onClick={() =>
            copyToClipboard(
              fullKit,
              "📋 Entire Creator Kit copied!"
            )
          }
          className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-2 text-sm font-medium text-fuchsia-200 transition hover:bg-fuchsia-500/20"
        >
          Copy All
        </button>
      </div>

      {/* Reel Hooks */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-xl font-semibold text-white">
          {labels.hooks}
        </h3>

        <div className="mt-5 space-y-3">
          {data.hooks?.map(
            (
              hook: string,
              index: number
            ) => (
              <div
                key={hook}
                className="flex items-start justify-between gap-4 rounded-2xl border border-fuchsia-500/10 bg-black/20 p-4"
              >
                <p className="text-gray-300">
                  {hook}
                </p>

                <button
                  onClick={() =>
                    copyToClipboard(
                      hook,
                      "📋 Hook copied!"
                    )
                  }
                  className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200 transition hover:bg-cyan-500/20"
                >
                  Copy
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Caption */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-semibold text-white">
            📝 Caption
          </h3>

          <button
            onClick={() =>
              copyToClipboard(
                data.caption,
                "📋 Caption copied!"
              )
            }
            className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
          >
            Copy
          </button>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-gray-300">
          {data.caption}
        </p>
      </div>
      

      {/* Hashtags */}

      {!["whatsapp_status", "whatsapp_community"].includes(platform) && (
  <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
    
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            #️⃣ Hashtags
          </h3>

          <button
            onClick={() =>
              copyToClipboard(
                data.hashtags?.join(" "),
                "📋 Hashtags copied!"
              )
            }
            className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
          >
            Copy
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {data.hashtags?.map(
            (tag: string) => (
              <div
                key={tag}
                className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200"
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>

  </div>
)}
   

      {/* Shot Plan */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
             {labels.shotPlan}
          </h3>

          <button
            onClick={() =>
              copyToClipboard(
                data.shotPlan?.join("\n"),
                "📋 Shot plan copied!"
              )
            }
            className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
          >
            Copy
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {data.shotPlan?.map(
            (
              shot: string,
              i: number
            ) => (
              <div
                key={shot}
                className="rounded-2xl border border-cyan-500/10 bg-black/20 p-4"
              >
                <p className="text-xs text-cyan-300">
                  Shot {i + 1}
                </p>

                <p className="mt-2 text-sm text-gray-300">
                  {shot}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Story Sequence */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            {labels.storyIdeas}
          </h3>

          <button
            onClick={() =>
              copyToClipboard(
                data.storyIdeas?.join(
                  "\n"
                ),
                "📋 Story sequence copied!"
              )
            }
            className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
          >
            Copy
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {data.storyIdeas?.map(
            (
              story: string,
              i: number
            ) => (
              <div
                key={story}
                className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center"
              >
                <p className="text-xs text-cyan-300">
                  Step {i + 1}
                </p>

                <p className="mt-2 text-sm text-gray-300">
                  {story}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* CTA */}

      <div className="rounded-3xl border border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-semibold text-white">
            🎯 Call To Action
          </h3>

          <button
            onClick={() =>
              copyToClipboard(
                data.cta,
                "📋 CTA copied!"
              )
            }
            className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
          >
            Copy
          </button>
        </div>

        <p className="mt-4 text-gray-300">
          {data.cta}
        </p>
      </div>
    </div>
  );
}