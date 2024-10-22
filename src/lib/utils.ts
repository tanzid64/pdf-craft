import { clsx, type ClassValue } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function constructMetadata({
  title = "PDFCraft - the SaaS for pdfs",
  description = "PDFCraft is a software to make chatting to your PDF files easy.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    applicationName: "PDFCraft",

    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@tanzid64",
    },
    icons,
    metadataBase: new URL("https://pdf-craft.vercel.app"),
    themeColor: "#FFF",
    authors: [{ name: "tanzid64" }],
    creator: "tanzid64",
    publisher: "tanzid64",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
