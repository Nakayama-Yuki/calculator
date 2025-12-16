import { useState, useRef, useEffect } from "react";

/**
 * キーボードショートカット情報を表示するコンポーネント
 * クリックするとキーボードショートカットのツールチップを表示
 */

export default function KeyboardShortcutInfo() {
  // ツールチップの表示状態を管理
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  // ツールチップの参照
  const tooltipRef = useRef<HTMLDivElement>(null);

  // ツールチップの表示/非表示を切り替える関数
  function toggleTooltip() {
    setShowTooltip((prev) => !prev);
  }

  // ツールチップ外のクリックを検出して非表示にする
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    // クリーンアップ関数
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleTooltip}
        className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
        aria-label="キーボードショートカット情報"
        aria-expanded={showTooltip}
        aria-controls="keyboard-shortcuts-tooltip"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      </button>

      {/* ツールチップ */}
      {showTooltip && (
        <div
          id="keyboard-shortcuts-tooltip"
          ref={tooltipRef}
          className="absolute right-0 mt-2 p-3 bg-white rounded-lg shadow-lg z-10 min-w-50 text-xs"
          role="tooltip"
        >
          <h3 className="font-medium text-sm mb-1 text-gray-900">
            キーボードでも操作できます:
          </h3>
          <ul className="space-y-1 text-gray-600">
            <li>数字キー: 0-9</li>
            <li>演算子: +, -, *, /</li>
            <li>小数点: . または ,</li>
            <li>計算: Enter または =</li>
            <li>クリア: Esc または C</li>
            <li>削除: Backspace</li>
          </ul>
        </div>
      )}
    </div>
  );
}
