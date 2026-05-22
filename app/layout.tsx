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
      "DescGen India — AI Product Descriptions for Meesho, Amazon & Flipkart",

    template:
      "%s — DescGen India",
  },

   verification: {
    google: "UaelPgLs6Xal66qjtjYhm3x6Z37tomjTEELpjp7WOKo",
  },

  description:
    "Write product listings 10x faster. AI descriptions optimized for Meesho, Amazon India, Flipkart, Myntra & Instagram — in English, Hindi & Telugu. Free to start.",

  keywords: [
    "product description generator India",
    "AI listing generator Meesho",
    "Amazon India product description tool",
    "Flipkart listing description generator",
    "bulk product description generator",
    "AI copywriting for Indian sellers",
    "Meesho seller tools",
    "Hindi product description generator",
    "e-commerce listing tool India",
    "product description in Telugu Hindi",
    "AI product listing tool",
    "Indian marketplace seller tool",
    "HSN code generator",
    "GST product category generator",
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
      "DescGen India — Write Product Listings 10x Faster with AI",

    description:
      "AI-powered product descriptions for Meesho, Amazon India, Flipkart, Myntra & Instagram. English, Hindi, Telugu. Bulk CSV upload. Free to start.",

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
      "DescGen India — AI Product Descriptions for Indian Sellers",

    description:
      "Generate Meesho, Amazon & Flipkart listings in seconds. Hindi, Telugu & English. Free to start.",

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
      <body className="min-h-full flex flex-col">

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
          "AI-powered product description generator built for Indian e-commerce sellers.",

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
          "AI product descriptions",
          "Marketplace optimization",
          "Bulk CSV generation",
          "Brand tone memory",
          "Multi-platform outputs",
          "HSN and GST code generation",
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
