import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin", "cyrillic"] });
const welcomeSerif = Cormorant_Garamond({ variable: "--font-welcome", subsets: ["latin", "cyrillic"], weight: "500", style: "italic" });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/findrive-logo.jpg`;

  return {
    title: "ФИНДРАЙВ Академия — обучающая платформа",
    description: "Демонстрационный кабинет обучения и комплаенс-контроля для амбассадоров ООО МКК «ФИНДРАЙВ».",
    openGraph: {
      title: "ФИНДРАЙВ Академия",
      description: "Обучение, комплаенс и допуск к работе в одном кабинете.",
      images: [{ url: image, width: 1280, height: 1280, alt: "Фирменный логотип ФИНДРАЙВ" }],
      type: "website",
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body className={`${geist.variable} ${welcomeSerif.variable}`}>{children}</body></html>;
}
