"use client";

import { useState } from "react";

/**
 * 計算機のディスプレイコンポーネント
 * 現在の計算結果や入力値、および計算式全体を表示します
 *
 * @param {DisplayProps} props - ディスプレイコンポーネントのプロパティ
 * @returns {JSX.Element} ディスプレイコンポーネント
 */
interface DisplayProps {
  value: string;
  expression: string;
}

/**
 * 計算機のディスプレイ部分を表示するコンポーネント
 * 入力値や計算式の長さに応じてフォントサイズが動的に変化します
 */
export default function Display({ value, expression }: DisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyWithExecCommand = (text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  };

  const canUseClipboardApi = () => {
    if (typeof window === "undefined") return false;
    if (!window.isSecureContext) return false;
    if (!navigator.clipboard?.writeText) return false;

    const policy = (
      document as Document & {
        permissionsPolicy?: { allowsFeature?: (feature: string) => boolean };
      }
    ).permissionsPolicy;
    const policyAllows = policy?.allowsFeature?.("clipboard-write");

    return policyAllows !== false;
  };

  /**
   * クリップボードに現在の値をコピーする
   */
  const handleCopy = async () => {
    try {
      if (canUseClipboardApi()) {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        // 2秒後にコピー状態をリセット
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      const fallbackSuccess = copyWithExecCommand(value);
      if (fallbackSuccess) {
        setCopied(true);
        // 2秒後にコピー状態をリセット
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      console.warn("クリップボードへのコピーがブロックされました。");
    } catch (error) {
      const fallbackSuccess = copyWithExecCommand(value);
      if (fallbackSuccess) {
        setCopied(true);
        // 2秒後にコピー状態をリセット
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      console.warn("クリップボードへのコピーに失敗しました:", error);
    }
  };
  /**
   * 入力値の長さに基づいてフォントサイズを調整するヘルパー関数
   * より長い値に対してより小さいフォントサイズを返します
   *
   * @returns {string} Tailwind CSSのフォントサイズクラス名
   */
  const getFontSizeClass = () => {
    const length = value.length;
    if (length > 12) return "text-2xl";
    if (length > 8) return "text-3xl";
    return "text-4xl";
  };

  /**
   * 式の長さに基づいてフォントサイズを調整するヘルパー関数
   * より長い式に対してより小さいフォントサイズを返します
   *
   * @returns {string} Tailwind CSSのフォントサイズクラス名
   */
  const getExpressionFontSizeClass = () => {
    const length = expression.length;
    if (length > 25) return "text-xs";
    if (length > 20) return "text-sm";
    return "text-base";
  };

  return (
    <div className="bg-(--display-bg) p-4 mb-4 rounded-lg text-right overflow-hidden transition-colors duration-300 ease-in-out h-30">
      {/* 計算式の表示エリア */}
      <div
        className={`${getExpressionFontSizeClass()} text-gray-300 font-medium mb-1 min-h-6 wrap-break-word`}
        aria-live="polite"
        role="status"
      >
        {expression}
      </div>

      {/* 現在値の表示エリアとコピーボタン */}
      <div className="flex items-end justify-between gap-2 min-h-12">
        <div
          className={`${getFontSizeClass()} text-white font-semibold flex-1 text-right`}
          aria-live="polite"
          role="status"
        >
          {value}
        </div>

        {/* コピーボタン */}
        <button
          onClick={handleCopy}
          className={`shrink-0 p-2 rounded transition-all duration-200 ${
            copied ?
              "bg-green-500 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600 active:scale-95"
          }`}
          aria-label="結果をコピー"
          title={copied ? "コピーしました！" : "結果をコピー"}
        >
          {
            copied ?
              // チェックマークアイコン（コピー成功）
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              // クリップボードアイコン（通常状態）
            : <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>

          }
        </button>
      </div>
    </div>
  );
}
