import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Dino Aventure - Jeux éducatifs pour enfants",
  description: "Des jeux amusants et éducatifs avec des dinosaures pour les enfants de 3 à 5 ans",
  keywords: ["dinosaures", "jeux enfants", "éducatif", "memory", "quiz"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${nunito.variable} font-[family-name:var(--font-nunito)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
