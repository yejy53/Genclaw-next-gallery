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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={playfair.variable}>
      <body>{children}</body>
    </html>
  );
}
