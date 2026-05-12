"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const PLATFORMS = ["Amazon", "Meesho", "Flipkart", "Instagram", "Myntra"];

const PLATFORM_PLACEHOLDERS: Record<string, string> = {
  Amazon:    "e.g. Professional, keyword-rich, highlight specs and pack size",
  Meesho:    "e.g. Warm and friendly, simple Hindi-friendly English, festive focus",
  Flipkart:  "e.g. Feature-focused bullet points, value for money emphasis",
  Instagram: "e.g. Casual and conversational, use emojis, story-driven captions",
  Myntra:    "e.g. Fashion-forward, style terminology, outfit pairing tips",
};

export default function SettingsPage() {
  const [loading,        setLoading]        = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [success,        setSuccess]        = useState("");
  const [error,          setError]          = useState("");
  const [brandName,      setBrandName]      = useState("");
  const [brandTone,      setBrandTone]      = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [writingStyle,   setWritingStyle]   = useState("");
  const [preferredCTA,   setPreferredCTA]   = useState("");
  const [platformTones,  setPlatformTones]  = useState<Record<string, string>>({});  // ← new

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select(`
            brand_name,
            brand_tone,
            target_audience,
            writing_style,
            preferred_cta,
            platform_tones
          `)                           // ← added platform_tones
          .eq("id", user.id)
          .single();

        if (error) {
          setError(error.message);
          return;
        }

        if (data) {
          setBrandName(      data.brand_name      || "");
          setBrandTone(      data.brand_tone      || "");
          setTargetAudience( data.target_audience || "");
          setWritingStyle(   data.writing_style   || "");
          setPreferredCTA(   data.preferred_cta   || "");
          setPlatformTones(  data.platform_tones  || {});  // ← new
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Unauthorized");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          brand_name:      brandName      || null,
          brand_tone:      brandTone      || null,
          target_audience: targetAudience || null,
          writing_style:   writingStyle   || null,
          preferred_cta:   preferredCTA   || null,
          platform_tones:  platformTones,          // ← new
        })
        .eq("id", user.id);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess("Settings saved successfully.");

    } catch (err) {
      console.error(err);
      setError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  // helper to update a single platform tone in state
  function updatePlatformTone(platform: string, value: string) {
    setPlatformTones((prev) => ({
      ...prev,
      [platform]: value,
    }));
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Brand Settings</h1>
        <p className="mt-2 text-sm text-gray-500">
          Personalize AI generations based on your brand identity.
        </p>
      </div>

      {loading && (
        <div className="rounded-xl border bg-white px-4 py-3 text-sm">
          Loading settings...
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">

        {/* ── General Brand Memory ─────────────────────────────────── */}
        <div className="flex flex-col gap-5 rounded-2xl border bg-white p-6">
          <div>
            <h2 className="text-base font-semibold">General Brand Memory</h2>
            <p className="mt-1 text-sm text-gray-500">
              Applied to all platforms unless a platform-specific tone is set below.
            </p>
          </div>

          {/* Brand Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. GlowFit, Rangi Studio"
              className="rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
            />
          </div>

          {/* Brand Tone */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Brand Tone</label>
            <textarea
              value={brandTone}
              onChange={(e) => setBrandTone(e.target.value)}
              placeholder="e.g. Energetic, Gen Z, emoji-heavy"
              rows={3}
              className="rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
            />
          </div>

          {/* Target Audience */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Target Audience</label>
            <textarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Urban women aged 25-40 who love ethnic wear"
              rows={3}
              className="rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
            />
          </div>

          {/* Writing Style */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Writing Style</label>
            <textarea
              value={writingStyle}
              onChange={(e) => setWritingStyle(e.target.value)}
              placeholder="e.g. Short punchy sentences, never use the word cheap"
              rows={3}
              className="rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
            />
          </div>

          {/* Preferred CTA */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Preferred CTA</label>
            <textarea
              value={preferredCTA}
              onChange={(e) => setPreferredCTA(e.target.value)}
              placeholder="e.g. Shop now before stock runs out"
              rows={2}
              className="rounded-xl border border-gray-200 p-3 outline-none focus:border-black"
            />
            <p className="text-xs text-gray-400">
              This exact phrase will appear at the end of every description.
            </p>
          </div>
        </div>

        {/* ── Platform-Specific Tone ───────────────────────────────── */}
        <div className="flex flex-col gap-5 rounded-2xl border bg-white p-6">
          <div>
            <h2 className="text-base font-semibold">Platform-Specific Tone</h2>
            <p className="mt-1 text-sm text-gray-500">
              Override your general writing style for a specific platform.
              Leave blank to use general settings above.
            </p>
          </div>

          {PLATFORMS.map((platform) => (
            <div key={platform} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">{platform}</label>
                {/* show "active" badge if a tone is set for this platform */}
                {platformTones[platform] && (
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                    Active
                  </span>
                )}
              </div>
              <input
                type="text"
                value={platformTones[platform] ?? ""}
                onChange={(e) => updatePlatformTone(platform, e.target.value)}
                placeholder={PLATFORM_PLACEHOLDERS[platform]}
                className="rounded-xl border border-gray-200 p-3 text-sm
                           outline-none focus:border-black"
              />
            </div>
          ))}

          {/* Show which platforms have overrides active */}
          {Object.keys(platformTones).some((k) => platformTones[k]) && (
            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium text-gray-500 mb-2">
                Active overrides:
              </p>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.filter((p) => platformTones[p]).map((p) => (
                  <span key={p}
                    className="rounded-full bg-gray-900 px-3 py-0.5 text-xs text-white">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Save button ──────────────────────────────────────────── */}
        <button
          type="submit"
          disabled={saving || loading}
          className="rounded-xl bg-black py-3 text-white transition
                     hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

      </form>
    </div>
  );
}