import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/legacy/styles/styles.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ZiyoFlix",
  description: "ZiyoFlix — kinolar, seriallar va onlayn kurslar platformasi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
