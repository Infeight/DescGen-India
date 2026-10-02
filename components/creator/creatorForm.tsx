"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function CreatorForm(
 { setCreatorResult, setPlatformForRes }: { setCreatorResult: any; setPlatformForRes: any }
) {


    const [
  productName,
  setProductName,
] = useState("");

const [
  productDetails,
  setProductDetails,
] = useState("");

const [
  niche,
  setNiche,
] = useState("Fashion");

const [
  platform,
  setPlatform,
] = useState("Instagram");

const [
  loading,
  setLoading,
] = useState(false);


  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      <h2 className="text-2xl font-semibold text-white">
        Generate Creator Kit
      </h2>

      <p className="mt-2 text-sm text-gray-400">
        Upload a product and let AI generate
        content ideas for your next collaboration.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        {/* Product Image */}

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-gray-300">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-400 file:mr-4 file:rounded-xl file:border-0 file:bg-fuchsia-500/20 file:px-4 file:py-2 file:text-white"
          />
        </div>

        {/* Product Name */}

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Product Name
          </label>

         <input
         className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-gray-400 file:mr-4 file:rounded-xl file:border-0 file:bg-fuchsia-500/20 file:px-4 file:py-2 file:text-white"
         placeholder="Portable desk lamp"
 value={productName}
 onChange={(e)=>
   setProductName(
     e.target.value
   )
 }
/>
        </div>

        {/* Platform */}

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Platform
          </label>

         <select
  value={platform}
  onChange={(e) => {
    setPlatform(e.target.value);
    setPlatformForRes(e.target.value);
  }}
  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white"
>
  <option value="instagram_reels">Instagram Reels</option>
  <option value="youtube_shorts">YouTube Shorts</option>
  <option value="whatsapp_status">WhatsApp Status</option>
  <option value="whatsapp_community">WhatsApp Community</option>
  <option value="facebook">Facebook</option>
</select>
        </div>

        {/* Creator Niche */}

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Creator Niche
          </label>

          <select
            value={niche}
            onChange={(e) =>
              setNiche(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white"
          >

            <option>
              Fashion
            </option>

            <option>
              Beauty
            </option>

            <option>
              Lifestyle
            </option>

            <option>
              Tech
            </option>

            <option>
              Food
            </option>

            <option>
              Travel
            </option>

          </select>
        </div>

        {/* Product Details */}

        <div className="md:col-span-2">

          <label className="mb-2 block text-sm text-gray-300">
            Product Details
          </label>

          <textarea
            value={productDetails}
            onChange={(e) =>
              setProductDetails(e.target.value)
            }
            rows={5}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white"
            placeholder="Portable, rechargeable, touch controls..."
          />
        </div>

      </div>

     <button

     className="mt-8 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-medium text-white transition hover:scale-[1.01] disabled:opacity-50"

disabled={loading}

onClick={async()=>{

try {

  setLoading(true);

  toast.loading(
    "AI is crafting your content...",
    {
      id: "creator",
    }
  );

  const response =
    await fetch(
      "/api/creator",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          productName,
          productDetails,
          niche,
          platform,
        }),
      }
    );

  const res =
    await response.json();

  if (!response.ok) {

    if (
      res.code ===
      "NO_CREDITS"
    ) {
      toast.error(
        "You need more credits to generate a Creator Kit.",
        {
          id: "creator",
        }
      );

      return;
    }

    throw new Error(
      res.error
    );
  }

  setCreatorResult(
    res
  );

  toast.success(
    "Creator Kit ready!",
    {
      id: "creator",
    }
  );

  setTimeout(() => {
    window.scrollTo({
      top:
        document.body
          .scrollHeight,
      behavior:
        "smooth",
    });
  }, 100);

} catch (err: any) {

  toast.error(
    err.message ||
    "Something went wrong.",
    {
      id: "creator",
    }
  );

  console.error(err);

} finally {

  setLoading(false);

}

}}

>
{
loading
?
"Generating..."
:
"Generate Kit (1 Credit)"
}
</button>

    </div>
  );
}