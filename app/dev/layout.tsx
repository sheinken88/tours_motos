import type { Metadata } from "next";
import { DistressSprite } from "@/components/ui/DistressSprite";
import { defaultLocale, localeCodes } from "@/lib/i18n/config";
import { fontBody, fontDisplay, fontScript } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Moto On/Off Dev",
  description: "Internal Moto On/Off design and component surfaces.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DevRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={localeCodes[defaultLocale]}
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontScript.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DistressSprite />
        {children}
      </body>
    </html>
  );
}
