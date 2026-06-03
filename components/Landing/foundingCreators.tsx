"use client";

import {
  Rocket,
  Gem,
  Target,
  Star,
} from "lucide-react";

const creators = [
  {
    name: "itsjustlumiiii",
    handle: "https://www.instagram.com/itsjustlumiiii/",
    niche: "fashion creator. lifestyle creator",
    avatar: "/collaborators/collab1.jpg",
  },
  {
    name: "ugcbyhiya",
    handle: "https://www.instagram.com/ugcbyhiya/",
    niche: "Creating aesthetic & relatable content for brands.",
        avatar: "/collaborators/collab2.jpg",
  },
  {
    name: "zoe_edits45",
    handle: "https://www.instagram.com/zoe_edits45/",
    niche: "Editing the scenes I can't forget ✨",
    avatar: "/collaborators/collab3.jpg",
  },
];

const benefits = [
  {
    icon: Rocket,
    title: "Early Access",
    description:
      "Get access to upcoming features before public release.",
  },
  {
    icon: Gem,
    title: "Creator Credits",
    description:
      "Receive complimentary credits while collaborating.",
  },
  {
    icon: Target,
    title: "Product Influence",
    description:
      "Help shape the future roadmap of DescGen India.",
  },
  {
    icon: Star,
    title: "Website Recognition",
    description:
      "Be featured as a Founding Creator on DescGen India.",
  },
];

export default function FoundingCreators() {
  return (
    <section
    id="founding-creators"
    className="relative overflow-hidden py-24">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 backdrop-blur-xl">
            Founding Creator Program
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Built With Creators Helping
            <br />
            Indian Sellers Grow
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400">
            Early creators are helping shape the future of
            marketplace intelligence for Indian ecommerce sellers.
            Join us and become part of the journey.
          </p>
        </div>

        {/* Creator Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {creators.map((creator) => (
            <div
              key={creator.niche}
              className="group rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-500/20"
            >
              <div className="inline-flex rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-200">
                Founding Creator
              </div>

              <div className="mt-6 flex flex-col items-center text-center">
                {/* Avatar Placeholder */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 text-2xl font-bold text-white">
                  <img src={creator.avatar} alt={creator.name} className="h-full w-full rounded-full object-cover" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  {creator.name}
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  <a href={creator.handle} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                    Meet {creator.name.split(" ")[0]}
                  </a>
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  {creator.niche}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-semibold text-white">
            Want to Join the Founding Creator Program?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Collaborate with DescGen India, receive creator credits,
            get early access to new features, and help shape the
            future of marketplace intelligence for Indian sellers.
          </p>

          <a
            href="mailto:tarundandugula1@gmail.com?subject=Founding Creator Program"
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-3 text-sm font-medium text-white transition hover:scale-[1.02]"
          >
            Apply to Collaborate
          </a>
        </div>

        {/* Benefits */}
        <div className="mt-20 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20">
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <h4 className="mt-5 text-lg font-semibold text-white">
                  {benefit.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Limited founding creator spots available during the
            DescGen India Public Beta.
          </p>
        </div>
      </div>
    </section>
  );
}