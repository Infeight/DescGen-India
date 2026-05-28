import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://descgen.shop"
  ),

  title: {
    default:
      "DescGen India — Marketplace Intelligence for Indian Sellers",

    template:
      "%s — DescGen India",
  },

   verification: {
    google: "UaelPgLs6Xal66qjtjYhm3x6Z37tomjTEELpjp7WOKo",
  },

  description:
    "Generate platform-aware ecommerce listings, preview marketplace layouts, analyze product images, and optimize buyer-facing content for Amazon, Flipkart, Myntra, Meesho, Instagram & WhatsApp using AI-powered marketplace intelligence.",

 keywords: [
  "AI marketplace intelligence",
  "ecommerce listing optimization",
  "Amazon listing AI",
  "Flipkart seller tools",
  "Meesho AI listings",
  "Myntra product optimization",
  "AI product image analysis",
  "marketplace listing previews",
  "Indian ecommerce seller tools",
  "AI listing analysis",
  "platform-aware ecommerce AI",
  "multilingual ecommerce AI",
  "WhatsApp selling tools India",
  "Instagram ecommerce AI",
],

  authors: [
    {
      name:
        "DescGen India",

      url:
        "https://descgen.shop",
    },
  ],

  creator:
    "DescGen India",

  publisher:
    "DescGen India",

  alternates: {
    canonical:
      "https://descgen.shop",
  },

  robots: {
    index: true,

    follow: true,

    googleBot: {
      index: true,

      follow: true,

      "max-image-preview":
        "large",

      "max-snippet":
        -1,

      "max-video-preview":
        -1,
    },
  },

  openGraph: {
    title:
      "DescGen India — AI Marketplace Intelligence for Indian Sellers",

    description:
      "Generate marketplace-native listings, analyze product images, preview buyer-facing layouts, and optimize ecommerce performance using AI-powered marketplace intelligence.",

    url:
      "https://descgen.shop",

    siteName:
      "DescGen India",

    locale:
      "en_IN",

    type:
      "website",

    images: [
      {
        url:
          "/og-image.png",

        width:
          1200,

        height:
          630,

        alt:
          "DescGen India — AI Product Description Generator for Indian Sellers",
      },
    ],
  },

  twitter: {
    card:
      "summary_large_image",

    site:
      "@descgenindia",

    creator:
      "@descgenindia",

    title:
      "DescGen India — Marketplace-Aware AI for Ecommerce Sellers",

    description:
      "AI-powered marketplace intelligence for Amazon, Flipkart, Myntra, Meesho, Instagram & WhatsApp sellers.",

    images: [
      "/og-image.png",
    ],
  },

  icons: {
    icon:
      "/favicon.ico",

    shortcut:
      "/favicon-16x16.png",

    apple:
      "/apple-touch-icon.png",
  },

  manifest:
    "/site.webmanifest",

  category:
    "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <body className="min-h-full overflow-x-hidden flex flex-col">

 <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context":
          "https://schema.org",

        "@type":
          "SoftwareApplication",

        name:
          "DescGen India",

        applicationCategory:
          "BusinessApplication",

        operatingSystem:
          "Web",

        description:
          "AI-powered marketplace intelligence platform for Indian ecommerce sellers. Generate marketplace-native listings, analyze product images, preview buyer-facing layouts, and optimize ecommerce performance across multiple platforms.",

        url:
          "https://descgen.shop",

        creator: {
          "@type":
            "Organization",

          name:
            "DescGen India",
        },

        offers: {
          "@type":
            "Offer",

          price:
            "0",

          priceCurrency:
            "INR",
        },

        featureList: [
  "Marketplace-aware AI listings",
  "AI listing analysis",
  "Marketplace preview simulation",
  "AI product image analysis",
  "Platform compatibility scoring",
  "Brand tone memory",
  "Bulk listing workflows",
  "Multi-platform optimization",
  "Multiple Indian languages",
],
      }),
    }}
  />


        {children}
        <Analytics />
        <Toaster
  position="top-right"
  richColors
  closeButton
  duration={3000}
  theme="dark"
/>
      </body>
    </html>
  );
}
