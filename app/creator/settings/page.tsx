"use client";

import { Settings, Sparkles } from "lucide-react";

export default function CreatorSettingsPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-2xl text-center">

        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10">
          <Settings className="h-9 w-9 text-cyan-400" />
        </div>

        {/* Content */}
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Creator Studio
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
          Settings are coming soon
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-zinc-400">
          We're working on a dedicated settings experience for creators.
          Account preferences, profile controls, notifications, and more
          will be available here soon.
        </p>

        {/* Status Card */}
        <div className="mx-auto mt-8 flex max-w-md items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-xl">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/10">
            <Sparkles className="h-5 w-5 text-fuchsia-400" />
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              We're building it
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              More creator controls are on the way.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}