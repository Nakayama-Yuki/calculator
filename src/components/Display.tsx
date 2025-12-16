"use client";

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
        role="status">
        {expression}
      </div>

      {/* 現在値の表示エリア - 固定高さを追加して安定させる */}
      <div
        className={`${getFontSizeClass()} text-white font-semibold min-h-12 flex items-end justify-end`}
        aria-live="polite"
        role="status">
        {value}
      </div>
    </div>
  );
}
