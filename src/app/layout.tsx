import type { Metadata, Viewport } from "next";
import { SerwistProvider } from "@serwist/next/react";
import { AuthProvider } from "@/lib/auth/auth-context";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CookieConsentProvider, CookieConsentSync } from "@/components/legal/CookieConsentProvider";
import { Poppins, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hammet",
  applicationName: "Hammet",
  description: "Learn, build, and create with Hammet.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Hammet",
  },
};

export const viewport: Viewport = {
  themeColor: "#6D28D9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${geistMono.variable} font-poppins h-full antialiased`}
    >
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function () {
              const stored = localStorage.getItem("hammet-theme");

              const theme =
                stored === "light" || stored === "dark"
                  ? stored
                  : window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";

              document.documentElement.classList.toggle(
                "dark",
                theme === "dark"
              );
            })();
          `}
        </Script>
      </head>

      <body className="min-h-full flex flex-col font-poppins">
        <SerwistProvider
          swUrl="/sw.js"
          cacheOnNavigation={false}
          disable={process.env.NODE_ENV !== "production"}
        >
          <AuthProvider>
            <CookieConsentProvider>
              <SmoothScrollProvider>{children}</SmoothScrollProvider>
              <CookieConsentSync />
            </CookieConsentProvider>
          </AuthProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
