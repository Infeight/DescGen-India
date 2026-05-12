"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Sparkles,
  Save,
  Globe2,
  BrainCircuit,
  CheckCircle2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const supabase =
  createClient();

const PLATFORMS = [
  "Amazon",
  "Meesho",
  "Flipkart",
  "Instagram",
  "Myntra",
];

const PLATFORM_PLACEHOLDERS: Record<
  string,
  string
> = {
  Amazon:
    "Professional, keyword-rich, highlight specifications and pack size",

  Meesho:
    "Warm and friendly, simple English, festive-focused tone",

  Flipkart:
    "Feature-focused, value-for-money positioning",

  Instagram:
    "Conversational, emoji-friendly, story-driven captions",

  Myntra:
    "Fashion-forward tone with styling suggestions",
};

export default function SettingsPage() {
  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [brandName, setBrandName] =
    useState("");

  const [brandTone, setBrandTone] =
    useState("");

  const [
    targetAudience,
    setTargetAudience,
  ] = useState("");

  const [
    writingStyle,
    setWritingStyle,
  ] = useState("");

  const [
    preferredCTA,
    setPreferredCTA,
  ] = useState("");

  const [
    platformTones,
    setPlatformTones,
  ] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);

        setError("");

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) return;

        const {
          data,
          error,
        } =
          await supabase
            .from(
              "profiles"
            )
            .select(`
              brand_name,
              brand_tone,
              target_audience,
              writing_style,
              preferred_cta,
              platform_tones
            `)
            .eq(
              "id",
              user.id
            )
            .single();

        if (error) {
          setError(
            error.message
          );

          return;
        }

        if (data) {
          setBrandName(
            data.brand_name ||
              ""
          );

          setBrandTone(
            data.brand_tone ||
              ""
          );

          setTargetAudience(
            data.target_audience ||
              ""
          );

          setWritingStyle(
            data.writing_style ||
              ""
          );

          setPreferredCTA(
            data.preferred_cta ||
              ""
          );

          setPlatformTones(
            data.platform_tones ||
              {}
          );
        }

      } catch (err) {
        console.error(err);

        setError(
          "Failed to load settings."
        );

      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSave(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setSaving(true);

      setSuccess("");

      setError("");

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setError(
          "Unauthorized"
        );

        return;
      }

      const { error } =
        await supabase
          .from(
            "profiles"
          )
          .update({
            brand_name:
              brandName ||
              null,

            brand_tone:
              brandTone ||
              null,

            target_audience:
              targetAudience ||
              null,

            writing_style:
              writingStyle ||
              null,

            preferred_cta:
              preferredCTA ||
              null,

            platform_tones:
              platformTones,
          })
          .eq(
            "id",
            user.id
          );

      if (error) {
        setError(
          error.message
        );

        return;
      }

      setSuccess(
        "Brand memory updated successfully."
      );

    } catch (err) {
      console.error(err);

      setError(
        "Failed to save settings."
      );

    } finally {
      setSaving(false);
    }
  }

  function updatePlatformTone(
    platform: string,
    value: string
  ) {
    setPlatformTones(
      (prev) => ({
        ...prev,
        [platform]:
          value,
      })
    );
  }

  function InputBlock({
    label,
    value,
    setValue,
    placeholder,
    rows = 3,
  }: {
    label: string;

    value: string;

    setValue: (
      v: string
    ) => void;

    placeholder: string;

    rows?: number;
  }) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>

        <textarea
          value={value}
          onChange={(e) =>
            setValue(
              e.target.value
            )
          }
          placeholder={
            placeholder
          }
          rows={rows}
          className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-500/40"
        />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-8">
      {/* Glow */}
      <div className="absolute left-1/2 top-0 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-lg shadow-fuchsia-500/20">
          <BrainCircuit className="h-7 w-7 text-white" />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white">
            AI Brand Memory
          </h1>

          <p className="mt-1 text-gray-400">
            Train your AI assistant
            to generate content
            aligned with your
            brand voice.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-300">
          {success}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="h-52 animate-pulse rounded-[32px] border border-white/10 bg-white/5" />
      )}

      {!loading && (
        <form
          onSubmit={
            handleSave
          }
          className="flex flex-col gap-8"
        >
          {/* General Memory */}
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl">
            <div className="mb-7">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-fuchsia-400" />

                <h2 className="text-2xl font-semibold text-white">
                  General Brand Memory
                </h2>
              </div>

              <p className="mt-2 text-sm text-gray-400">
                These settings
                apply across all
                AI generations.
              </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">
                  Brand Name
                </label>

                <input
                  type="text"
                  value={
                    brandName
                  }
                  onChange={(
                    e
                  ) =>
                    setBrandName(
                      e.target
                        .value
                    )
                  }
                  placeholder="GlowFit, Rangi Studio..."
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-500/40"
                />
              </div>

              <InputBlock
                label="Brand Tone"
                value={
                  brandTone
                }
                setValue={
                  setBrandTone
                }
                placeholder="Energetic, Gen Z, premium, emoji-heavy..."
              />

              <InputBlock
                label="Target Audience"
                value={
                  targetAudience
                }
                setValue={
                  setTargetAudience
                }
                placeholder="Urban women aged 25–40 interested in ethnic fashion..."
              />

              <InputBlock
                label="Writing Style"
                value={
                  writingStyle
                }
                setValue={
                  setWritingStyle
                }
                placeholder="Short punchy lines, avoid using the word cheap..."
              />
            </div>

            <div className="mt-6">
              <InputBlock
                label="Preferred CTA"
                value={
                  preferredCTA
                }
                setValue={
                  setPreferredCTA
                }
                placeholder="Shop now before stock runs out..."
                rows={2}
              />

              <p className="mt-2 text-xs text-gray-500">
                This CTA can be
                reused across
                generated outputs.
              </p>
            </div>
          </div>

          {/* Platform Overrides */}
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur-2xl">
            <div className="mb-7">
              <div className="flex items-center gap-3">
                <Globe2 className="h-5 w-5 text-cyan-400" />

                <h2 className="text-2xl font-semibold text-white">
                  Marketplace Overrides
                </h2>
              </div>

              <p className="mt-2 text-sm text-gray-400">
                Customize AI tone
                separately for
                each marketplace.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {PLATFORMS.map(
                (
                  platform
                ) => (
                  <div
                    key={
                      platform
                    }
                    className="rounded-3xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {
                          platform
                        }
                      </h3>

                      {platformTones[
                        platform
                      ] && (
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                          Active
                        </span>
                      )}
                    </div>

                    <textarea
                      value={
                        platformTones[
                          platform
                        ] ??
                        ""
                      }
                      onChange={(
                        e
                      ) =>
                        updatePlatformTone(
                          platform,
                          e
                            .target
                            .value
                        )
                      }
                      placeholder={
                        PLATFORM_PLACEHOLDERS[
                          platform
                        ]
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500/40"
                    />
                  </div>
                )
              )}
            </div>

            {Object.keys(
              platformTones
            ).some(
              (k) =>
                platformTones[
                  k
                ]
            ) && (
              <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />

                  <p className="text-sm font-medium text-white">
                    Active Marketplace Overrides
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.filter(
                    (p) =>
                      platformTones[
                        p
                      ]
                  ).map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={
              saving ||
              loading
            }
            className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[1.01] disabled:opacity-50"
          >
            <Save className="h-5 w-5" />

            {saving
              ? "Saving..."
              : "Save Brand Memory"}
          </button>
        </form>
      )}
    </div>
  );
}