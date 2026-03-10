import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LiveChat } from "@/components/LiveChat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MentorKonnect — Find your mentor, grow your career",
  description:
    "MentorKonnect connects ambitious professionals with experienced mentors for structured 1:1 sessions, programme bookings, and real-time guidance.",
  keywords: ["mentorship", "career development", "coaching", "mentoring platform"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <LiveChat />
      </body>
    </html>
  );
}
