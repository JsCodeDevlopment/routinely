import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/session-provider";
import AuthenticatedLayout from "@/components/authenticated-layout";
import type React from "react";

import "./globals.css";
import "react-quill/dist/quill.snow.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  return {
    title: "Routinely",
    description: "A dynamic calendar system for managing your schedule.",
    keywords: ["calendar", "notes", "daily", "system", "schedule", "dynamic"],
    openGraph: {
      title: "Routinely",
      description: "A dynamic calendar system for managing your schedule",
      images: [
        {
          url: "https://routinely-calendar.vercel.app/logo.png",
          alt: "Routinely Logotype",
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
