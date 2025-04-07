"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * テーマの種類を定義
 */
type Theme = "light" | "dark";

/**
 * テーマコンテキストの型定義
 */
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

/**
 * Providerのpropsの型定義
 */
interface ThemeProviderProps {
  children: React.ReactNode;
}

// デフォルト値でコンテキストを作成
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * テーマプロバイダーコンポーネント
 * アプリケーション全体でテーマ状態を共有するためのプロバイダー
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // テーマ状態を管理するためのステート
  const [theme, setTheme] = useState<Theme>("dark");

  // 初期化時にローカルストレージからテーマ設定を読み込む
  useEffect(() => {
    // ブラウザのプリファレンスをチェック
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // ローカルストレージから保存されたテーマを取得
    const savedTheme = localStorage.getItem("calculator-theme") as Theme | null;

    // 保存されたテーマがあればそれを使用、なければブラウザのプリファレンスをデフォルトとする
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);

    // HTML要素にテーマクラスを適用
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  /**
   * テーマを切り替える関数
   */
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";

      // ローカルストレージにテーマ設定を保存
      localStorage.setItem("calculator-theme", newTheme);

      // HTML要素にテーマクラスを適用/削除
      document.documentElement.classList.toggle("dark", newTheme === "dark");

      return newTheme;
    });
  };

  // コンテキスト値
  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * テーマコンテキストを使用するためのカスタムフック
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
