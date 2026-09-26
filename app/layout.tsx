import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mockup Tumbler",
  description: "Buat mockup tumbler dengan mudah.",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="id"><body>{children}</body></html>;
}