"use client";

import { toast } from "sonner";

export default function BrandOutreachResults({
  result,
}: any) {
  const copyToClipboard =
    async (
      text: string,
      message: string
    ) => {
      try {
        await navigator.clipboard.writeText(
          text
        );

        toast.success(
          message
        );
      } catch {
        toast.error(
          "Failed to copy."
        );
      }
    };

 const cards = [
  {
    title: "💬 Cold DM",
    content: result.coldDM,
    type: "text",
  },
  {
    title: "📧 Outreach Email",
    content: result.outreachEmail,
    type: "email",
  },
  {
    title: "🔄 Follow-Up Message",
    content: result.followUpMessage,
    type: "text",
  },
  {
    title: "⭐ Creator Pitch",
    content: result.creatorPitch,
    type: "text",
  },
];


const fullOutreach = `
💬 COLD DM

${result.coldDM}

📧 OUTREACH EMAIL

Subject:
${result.outreachEmail.subject}

${result.outreachEmail.body}

📊 MEDIA KIT HIGHLIGHTS

${result.mediaKitHighlights.join("\n")}

🔄 FOLLOW-UP MESSAGE

${result.followUpMessage}

⭐ CREATOR PITCH

${result.creatorPitch}
`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          🤝 Outreach Assets
        </h2>

        <button
          onClick={() =>
            copyToClipboard(
  fullOutreach,
  "📋 Copied all assets!"
)
          }
          className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-2 text-sm text-fuchsia-200"
        >
          Copy All
        </button>
      </div>

      {cards.map((card) => (
  <div
    key={card.title}
    className="rounded-3xl border border-white/10 bg-white/5 p-6"
  >
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-xl font-semibold text-white">
        {card.title}
      </h3>

      <button
        onClick={() =>
          copyToClipboard(
            card.type === "email"
              ? `Subject: ${card.content.subject}\n\n${card.content.body}`
              : card.content,
            "📋 Copied!"
          )
        }
        className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
      >
        Copy
      </button>
    </div>

    {card.type === "email" ? (
      <div className="space-y-4">
        <div className="rounded-2xl border border-fuchsia-500/10 bg-black/20 p-4">
          <p className="mb-2 text-xs uppercase tracking-wider text-fuchsia-300">
            Subject
          </p>

          <p className="text-gray-300">
            {card.content.subject}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-500/10 bg-black/20 p-4">
          <p className="mb-2 text-xs uppercase tracking-wider text-cyan-300">
            Email Body
          </p>

          <p className="whitespace-pre-wrap text-gray-300">
            {card.content.body}
          </p>
        </div>
      </div>
    ) : (
      <p className="whitespace-pre-wrap text-gray-300">
        {card.content}
      </p>
    )}
  </div>
))}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            📊 Media Kit Highlights
          </h3>

          <button
            onClick={() =>
              copyToClipboard(
                result.mediaKitHighlights?.join(
                  "\n"
                ),
                "📋 Highlights copied!"
              )
            }
            className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"
          >
            Copy
          </button>
        </div>

        <div className="space-y-3">
          {result.mediaKitHighlights?.map(
            (
              item: string,
              index: number
            ) => (
              <div
                key={index}
                className="rounded-2xl border border-fuchsia-500/10 bg-black/20 p-4 text-gray-300"
              >
                • {item}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}