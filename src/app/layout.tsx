import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import ApiProvider from "@/utils/ApiProvider";
import { ApiKeyProvider } from "@/context/ApiKeyContext";
import { cn } from "@/lib/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LangSpeak - Real-time Language Translation",
  description:
    "Experience seamless real-time language translation with LangSpeak. Powered by advanced AI technology for accurate and instant translations.",
  openGraph: {
    title: "LangSpeak - Real-time Language Translation",
    description:
      "Experience seamless real-time language translation with LangSpeak. Powered by advanced AI technology for accurate and instant translations.",
    url: "https://langspeak.vercel.app",
    siteName: "LangSpeak",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LangSpeak - Real-time Language Translation",
    description:
      "Experience seamless real-time language translation with LangSpeak. Powered by advanced AI technology for accurate and instant translations.",
    creator: "@yourtwitterhandle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        <ApiKeyProvider>
          <ApiProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="relative flex min-h-screen flex-col">
                <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="container flex h-14 max-w-screen-2xl items-center">
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                      <ThemeToggle />
                    </div>
                  </div>
                </header>
                <main className="flex-1">{children}</main>
              </div>
            </ThemeProvider>
          </ApiProvider>
        </ApiKeyProvider>
      </body>
    </html>
  );
}
