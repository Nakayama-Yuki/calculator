"use client";

import Calculator from "@/components/Calculator";

/**
 * 計算機アプリのホームページ
 * 2025年4月7日作成
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 transition-colors duration-300">
          電卓アプリ
        </h1>
      </header>

      <main>
        <Calculator />
      </main>

      <footer className="mt-12 text-center text-sm opacity-70 transition-colors duration-300">
        <p>© 2025 電卓アプリ</p>
      </footer>
    </div>
  );
}
