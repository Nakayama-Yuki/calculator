"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * テーマ切り替えボタンコンポーネント
 * ダークモードとライトモードを切り替えるためのボタン
 */
const ThemeToggle: React.FC = () => {
  // テーマコンテキストから現在のテーマと切り替え関数を取得
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors hover:bg-slate-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label={
        theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"
      }>
      {theme === "dark" ? (
        // 太陽アイコン（ライトモードに切り替えるアイコン）
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-amber-300">
          <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM12 15.75a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V16.5a.75.75 0 0 1 .75-.75ZM5.636 5.636a.75.75 0 0 1 1.06 0l1.592 1.592a.75.75 0 0 1-1.061 1.06L5.636 6.697a.75.75 0 0 1 0-1.06ZM17.03 17.03a.75.75 0 0 1 1.06 0l1.592 1.592a.75.75 0 0 1-1.061 1.06l-1.591-1.592a.75.75 0 0 1 0-1.06ZM3 12a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12ZM18 12a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5h-2.25A.75.75 0 0 1 18 12ZM5.636 17.03a.75.75 0 0 1 0 1.06l-1.592 1.592a.75.75 0 0 1-1.06-1.061l1.592-1.591a.75.75 0 0 1 1.06 0ZM17.03 5.636a.75.75 0 0 1 0 1.06l-1.592 1.592a.75.75 0 0 1-1.06-1.061l1.592-1.591a.75.75 0 0 1 1.06 0Z" />
        </svg>
      ) : (
        // 月アイコン（ダークモードに切り替えるアイコン）
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-slate-700">
          <path
            fillRule="evenodd"
            d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
