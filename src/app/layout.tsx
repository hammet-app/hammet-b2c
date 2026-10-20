import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth/auth-context";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
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
  title: "Hammet App",
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
        <AuthProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
