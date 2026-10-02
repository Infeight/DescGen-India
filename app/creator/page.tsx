"use client";

import {
  useState,
} from "react";

import CreatorHero from "@/components/creator/creatorHero";
import CreatorTabs from "@/components/creator/creatorSideBar";
import CreatorForm from "@/components/creator/creatorForm";
import CreatorOutput from "@/components/creator/creatorOutput";
import ComingSoon from "@/components/creator/comingSoon";
import PriceNegotiator from "@/components/creator/Pricing/priceNegotiator";

import BrandOutreach from "@/components/creator/BrandOutreach/brandOutreach";

export default function CreatorPage() {

  const [
    active,
    setActive,
  ] =
    useState(
      "content"
    );

    const [
  creatorResult,
  setCreatorResult,
] = useState(null);

const [platform, setPlatform] = useState("instagram_reels");

  return (
    <main className="min-h-screen bg-black">

      <div className="mx-auto max-w-7xl px-4 py-10">

        <CreatorHero />

<CreatorTabs
            active={active}
            setActive={setActive}
          />
        <div className="mt-12 grid gap-8">

          

          <div>

            {active ===
              "content" && (
              <>
               <CreatorForm
               setPlatformForRes={setPlatform}
  setCreatorResult={
    setCreatorResult
  }
/>

<CreatorOutput
  data={
    creatorResult
  }
  platform={platform}
/>
              </>
            )}

            {active ===
              "outreach" && (
              <BrandOutreach />
            )}

            {active ===
              "pricing" && (
              <PriceNegotiator/>
            )}

            {active ===
              "profile" && (
              <ComingSoon
                title="Profile Analyzer"
              />
            )}

          

          </div>

        </div>

      </div>

    </main>
  );
}