import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GenClaw-Next Visual Archive",
    template: "%s · GenClaw-Next",
  },
  description:
    "A curated archive of web, poster, slide, and infographic experiments.",
};

// Runs before first paint so a stored light choice never flashes dark first.
// Dark stays the default when nothing has been chosen; swap the fallback for a
// prefers-color-scheme check to follow the operating system instead.
const themeScript = `(function(){try{var t=localStorage.getItem("genclaw-theme");if(t!=="light"&&t!=="dark")t="dark";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={playfair.variable}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
