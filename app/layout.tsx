import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sassandra-guide",
  description:
    "Le guide numérique de Sassandra : hôtels, restaurants, plages, services et bonnes adresses.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b5d6b",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header>
          <Link href="/">🌊 Sassandra-guide</Link>
        </header>
        <main>{children}</main>
        <footer>
          Sassandra-guide · Informations données à titre indicatif.
          <br />
          Une erreur ? Signalez-la depuis la fiche du lieu.
        </footer>
      </body>
    </html>
  );
}
