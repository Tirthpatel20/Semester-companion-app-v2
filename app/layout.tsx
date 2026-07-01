import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    template: "%s | SemesterSync",
    default: "SemesterSync",
  },
  description:
    "Track attendance, Track CGPA, manage subjects, and stay organized with SemesterSync—the modern academic dashboard for college students.",
  keywords: [
    "attendance tracker",
    "semester planner",
    "student dashboard",
    "college attendance",
    "academic management",
  ],
  twitter: {
    card: "summary_large_image",
    title: "SemesterSync",
    description: "Track attendance and predict CGPA.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  applicationName: "SemesterSync",
  creator: "Tirth Patel",
  authors: [
    {
      name: "Tirth Patel",
    },
  ],category: "Education",
  openGraph: {
    title: "SemesterSync",
    description: "Track attendance, predict CGPA and manage your semester.",
    url: "https://semestersync.vercel.app",
    siteName: "SemesterSync",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-background dark`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
