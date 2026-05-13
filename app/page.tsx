
import  Navbar from "@/components/Landing/navbar";
import Hero from "@/components/Landing/hero";
import DemoGenerator from "@/components/Landing/demo-generator";
import Features from "@/components/Landing/features";
import PricingPreview from "@/components/Landing/pricing-preview";
import FinalCTA from "@/components/Landing/final-cta";
import Footer from "@/components/Landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      <Hero />

      <DemoGenerator />

      <Features />

      <PricingPreview />

      <FinalCTA />

      <Footer />
    </main>
  );
}