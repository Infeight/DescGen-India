"use client";

const items = [
  {
    id: "content",
    icon: "🎬",
    label: "Content Kit",
  },
  {
    id: "outreach",
    icon: "🤝",
    label: "Outreach",
  },
  {
    id: "pricing",
    icon: "💰",
    label: "Price Negotiator",
  },
  {
    id: "profile",
    icon: "📊",
    label: "Profile Analyzer",
  },
];

export default function CreatorFeatureTabs({
  active,
  setActive,
}: any) {
  return (
    <div className="mt-8">

      <div
        className="
        grid
        grid-cols-2
        gap-3

        lg:grid-cols-4
        "
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              setActive(item.id)
            }
            className={`
              rounded-2xl
              border
              p-4

              transition-all
              duration-200

              ${
                active === item.id
                  ? "border-cyan-500/20 bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 text-white"
                  : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <div className="text-2xl">
              {item.icon}
            </div>

            <p className="mt-2 text-sm font-medium">
              {item.label}
            </p>
          </button>
        ))}
      </div>

    </div>
  );
}