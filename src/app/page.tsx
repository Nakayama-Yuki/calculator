import Calculator from "@/components/Calculator";

/**
 * 計算機アプリのホームページ
 * 2025年4月7日作成
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">電卓アプリ</h1>
      </header>

      <main>
        <Calculator />
      </main>

      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>© 2025 電卓アプリ</p>
      </footer>
    </div>
  );
}
