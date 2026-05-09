import type { Metadata } from "next";
import { DistressSprite } from "@/components/ui/DistressSprite";
import { fontBody, fontDisplay, fontScript } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moto On/Off",
  description: "Motorcycle expeditions for riders who ride to conquer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontScript.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DistressSprite />
        {children}
      </body>
    </html>
  );
}
