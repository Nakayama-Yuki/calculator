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

  /**
   * テーマを適用する関数
   * HTMLルート要素とbody要素にテーマクラスを適用
   */
  const applyTheme = (selectedTheme: Theme) => {
    // HTMLルート要素にテーマクラスを適用/削除
    document.documentElement.classList.toggle("dark", selectedTheme === "dark");

    // body要素がテーマの変更を認識できるように追加処理
    document.body.dataset.theme = selectedTheme;

    // ローカルストレージにテーマ設定を保存
    localStorage.setItem("calculator-theme", selectedTheme);
  };

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

    // テーマを適用
    applyTheme(initialTheme);
  }, []);

  /**
   * テーマを切り替える関数
   */
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";

      // テーマを適用
      applyTheme(newTheme);

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
