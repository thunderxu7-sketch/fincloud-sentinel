import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "FinCloud Sentinel · Financial transaction assurance",
    template: "%s · FinCloud Sentinel",
  },
  description:
    "An open-source reference solution for idempotent financial transactions, reconciliation, cloud-native operations, and evidence-grounded AI incident response.",
  metadataBase: new URL("https://thunderxu7-sketch.github.io/fincloud-sentinel/"),
  openGraph: {
    title: "FinCloud Sentinel",
    description: "From transaction integrity to AI-assisted operations, with evidence at every layer.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable}`}><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
