export default function CreatorHero() {
  return (
    <section>
      <div className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
        🎥 Creator Studio
      </div>

      <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
        Turn Products Into
        <br />
        Scroll-Stopping Content
      </h1>

      <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-400">
        Generate reel hooks, captions,
        shot plans, story ideas,
        and creator-ready content kits
        in seconds.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {[
          "Instagram",
          "YouTube Shorts",
          "Whatsapp",
          "UGC",
          "Brand Deals",
          "Facebook Reels",
        ].map((item) => (
          <div
            key={item}
            className="rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-200"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}