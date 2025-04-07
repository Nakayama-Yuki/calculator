"use client";

import React from "react";

/**
 * 計算機のディスプレイコンポーネント
 * 現在の計算結果や入力値を表示します
 */
interface DisplayProps {
  value: string;
}

const Display: React.FC<DisplayProps> = ({ value }) => {
  // 値の長さに応じてフォントサイズを調整するためのクラス
  const getFontSizeClass = () => {
    const length = value.length;
    if (length > 12) return "text-2xl";
    if (length > 8) return "text-3xl";
    return "text-4xl";
  };

  return (
    <div className="bg-[var(--display-bg)] p-4 mb-4 rounded-lg text-right overflow-hidden transition-colors duration-300 ease-in-out">
      <div
        className={`${getFontSizeClass()} text-white font-semibold transition-all`}
        aria-live="polite"
        role="status">
        {value}
      </div>
    </div>
  );
};

export default Display;
