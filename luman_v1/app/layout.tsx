import type { Metadata } from "next";
import { Raleway, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Cursor } from "@/components/ui/cursor";

const raleway = Raleway({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luman Studio",
  description:
    "Luman Studio is a multidisciplinary agency working across strategy, design, technology, and creative production.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${raleway.variable} ${lora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
