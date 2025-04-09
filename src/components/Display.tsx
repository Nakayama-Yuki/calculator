"use client";

/**
 * 計算機のディスプレイコンポーネント
 * 現在の計算結果や入力値、および計算式全体を表示します
 */
interface DisplayProps {
  value: string;
  expression: string;
}

export default function Display({ value, expression }: DisplayProps) {
  // 入力値の長さに基づいてフォントサイズを調整
  const getFontSizeClass = () => {
    const length = value.length;
    if (length > 12) return "text-2xl";
    if (length > 8) return "text-3xl";
    return "text-4xl";
  };

  // 式の長さに基づいてフォントサイズを調整
  const getExpressionFontSizeClass = () => {
    const length = expression.length;
    if (length > 25) return "text-xs";
    if (length > 20) return "text-sm";
    return "text-base";
  };

  return (
    <div className="bg-[var(--display-bg)] p-4 mb-4 rounded-lg text-right overflow-hidden transition-colors duration-300 ease-in-out">
      {/* 計算式の表示エリア */}
      <div
        className={`${getExpressionFontSizeClass()} text-gray-300 font-medium mb-1 min-h-[1.5rem] break-words`}
        aria-live="polite"
        role="status">
        {expression}
      </div>

      {/* 現在値の表示エリア */}
      <div
        className={`${getFontSizeClass()} text-white font-semibold transition-all`}
        aria-live="polite"
        role="status">
        {value}
      </div>
    </div>
  );
}
