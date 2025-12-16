import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "電卓アプリ",
  description: "Next.js、React、Tailwindcssを使用した計算機アプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
