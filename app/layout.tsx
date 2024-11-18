import { AuthProvider } from "@/components/providers/auth-provider";
import ModalProvider from "@/components/providers/modal-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StudyAI - Your AI Study Companion",
  description:
    "Transform your study materials into interactive learning experiences.",
  openGraph: {
    title: "StudyAI - Your AI Study Companion",
    description:
      "Transform your study materials into interactive learning experiences.",
  },
  keywords:
    "AI study companion, AI study tool, AI study assistant, AI study partner, AI study helper, AI study tutor, AI study mentor, AI study coach, AI study tutor, AI study mentor, AI study coach, AI study tutor, AI study mentor, AI study coach",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextTopLoader
          color="rgb(46, 144, 250)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px rgb(46, 144, 250),0 0 5px rgb(46, 144, 250)"
        />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
            <Toaster />
            <ModalProvider />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
