"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function BrandOutreachForm({
  loading,
  setLoading,
  setResult,
}: any) {
  const [formData, setFormData] =
    useState({
      creatorName: "",
      creatorNiche: "",
      platform: "",
      followers: "",
      targetBrandCategory: "",
    });

  const handleGenerate =
    async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/creator/outreach-kit",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                formData
              ),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error
          );
        }

        setResult(data);

        toast.success(
          "🤝 Outreach Kit Generated!"
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
      } catch (error: any) {
        toast.error(
          error.message ||
            "Failed to generate outreach kit."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
         <h2 className="text-2xl font-semibold text-white">
  Generate Brand Outreach Kit
</h2>

<p className="mt-2 text-sm text-gray-400">
  Generate outreach messages,
  collaboration emails and creator
  pitches for your next partnership.
</p>
        </div>

       
      </div>

     <div className="mt-8 grid gap-6 md:grid-cols-2">

       <div className="md:col-span-2">
       <label className="mb-2 block text-sm text-gray-300">
    Creator Name
  </label>
        <input
          placeholder="Creator Name"
          value={
            formData.creatorName
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              creatorName:
                e.target.value,
            })
          }
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white"
        />
        </div>

         <div className="md:col-span-2">
         <label className="mb-2 block text-sm text-gray-300">
    Follwers Count
  </label>

        <input
          placeholder="Followers"
          value={
            formData.followers
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              followers:
                e.target.value,
            })
          }
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white"
        />
        </div>


          <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-gray-300">
    Creator Niche
  </label>

        <select
          value={
            formData.creatorNiche
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              creatorNiche:
                e.target.value,
            })
          }
          className="rounded-2xl border border-white/10 bg-black/20 p-4 text-white"
        >
          <option value="">
            Select Niche
          </option>

         {/* Beauty sub-niches */}
<option value="skincare">Skincare</option>
<option value="makeup">Makeup & GRWM</option>
<option value="haircare">Haircare</option>

{/* // Fashion */}
<option value="streetwear">Streetwear</option>
<option value="ethnic_fashion">Ethnic & Traditional Wear</option>
<option value="sustainable_fashion">Sustainable Fashion</option>

{/* // Food */}
<option value="home_cooking">Home Cooking</option>
<option value="street_food">Street Food</option>
<option value="baking">Baking & Desserts</option>

{/* // Fitness */}
<option value="gym_fitness">Gym & Weightlifting</option>
<option value="yoga_wellness">Yoga & Wellness</option>
<option value="weight_loss">Weight Loss Journey</option>

{/* // Lifestyle */}
<option value="mom_lifestyle">Mom & Parenting</option>
<option value="student_lifestyle">Student Life</option>
<option value="luxury_lifestyle">Luxury Lifestyle</option>

{/* // Others */}
<option value="finance">Personal Finance</option>
<option value="tech_reviews">Tech Reviews</option>
<option value="gaming">Gaming</option>
<option value="travel">Travel</option>
<option value="education">Education & Edtech</option>
<option value="home_decor">Home Decor</option>
<option value="pets">Pets</option>
<option value="wedding">Wedding & Events</option>

<option value="ecommerce_selling">E-commerce & Online Selling</option>
<option value="business_entrepreneur">Business & Entrepreneurship</option>
<option value="reselling">Reselling & Dropshipping</option>
<option value="small_business">Small Business Owner</option>
<option value="digital_marketing">Digital Marketing</option>
        </select>

        </div>



       <div className="md:col-span-2">
         <label className="mb-2 block text-sm text-gray-300">
    Select Platform
  </label>

        <select
          value={
            formData.platform
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              platform:
                e.target.value,
            })
          }
          className="rounded-2xl border border-white/10 bg-black/20 p-4 text-white"
        >
          <option value="">
            Select Platform
          </option>

          <option>
            Instagram
          </option>

          <option>
            YouTube
          </option>

          <option>
            LinkedIn
          </option>

          <option>
            Facebook
          </option>
        </select>

</div>


        <div className="md:col-span-2">

          <label className="mb-2 block text-sm text-gray-300">
    Target Brand Category
  </label>
          <select
            value={
              formData.targetBrandCategory
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                targetBrandCategory:
                  e.target.value,
              })
            }
            className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white"
          >
            <option value="">
              Target Brand Category
            </option>

           <option value="skincare_brand">Skincare Brand</option>
<option value="makeup_brand">Makeup Brand</option>
<option value="fashion_brand">Fashion & Apparel</option>
<option value="ethnic_wear_brand">Ethnic Wear Brand</option>
<option value="jewellery_brand">Jewellery Brand</option>
<option value="fitness_supplement">Fitness & Supplements</option>
<option value="health_wellness">Health & Wellness</option>
<option value="food_beverage">Food & Beverage</option>
<option value="home_decor_brand">Home Decor Brand</option>
<option value="electronics">Electronics & Gadgets</option>
<option value="saas_tools">SaaS & Digital Tools</option>
<option value="edtech">EdTech Platform</option>
<option value="fintech">Fintech & Finance App</option>
<option value="travel_brand">Travel & Hospitality</option>
<option value="baby_kids">Baby & Kids Products</option>
<option value="pet_brand">Pet Products</option>
<option value="wedding_brand">Wedding Services</option>
<option value="saas_ecommerce">SaaS & E-commerce Tools</option>
<option value="ai_tools">AI Tools & Productivity</option>
          </select>
        </div>
      </div>

      <button
        disabled={loading}
        onClick={
          handleGenerate
        }
        className="mt-8 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-6 py-4 font-medium text-white transition hover:scale-[1.01] disabled:opacity-50"
      >
        {loading
          ? "Generating Outreach Assets..."
          : "Generate Kit (1 credit)"}
      </button>
    </div>
  );
}