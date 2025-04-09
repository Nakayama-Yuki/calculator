"use client";

/**
 * 計算機のキーパッドコンポーネントのプロパティ
 */
interface KeyPadProps {
  onDigit: (digit: string) => void;
  onDecimal: () => void;
  onOperator: (operator: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onAllClear: () => void;
  onPercent: () => void;
  onToggleSign: () => void;
}

/**
 * ボタンコンポーネントのプロパティ
 */
interface CalcButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  ariaLabel: string;
}

/**
 * 計算機のボタンコンポーネント
 */
function CalcButton({
  onClick,
  className = "",
  children,
  ariaLabel,
}: CalcButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg text-xl font-medium transition-all 
                 hover:brightness-125 active:scale-95 focus:outline-none 
                 focus:ring-2 focus:ring-blue-400 ${className}`}
      aria-label={ariaLabel}>
      {children}
    </button>
  );
}

/**
 * 計算機のキーパッドコンポーネント
 * 数字や演算子などのボタンを表示する
 */
export default function KeyPad({
  onDigit,
  onDecimal,
  onOperator,
  onEquals,
  onClear,
  onPercent,
  onToggleSign,
}: KeyPadProps) {
  // ボタンのスタイル定義 - CSS変数を使用
  const operatorStyle = "bg-[var(--button-operator-bg)] text-white";
  const numberStyle = "bg-[var(--button-number-bg)] text-white";
  const functionStyle = "bg-[var(--button-function-bg)] text-white";

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* 機能ボタン行 */}
      <CalcButton
        onClick={onClear}
        className={functionStyle}
        ariaLabel="クリア">
        C
      </CalcButton>
      <CalcButton
        onClick={onToggleSign}
        className={functionStyle}
        ariaLabel="符号反転">
        +/-
      </CalcButton>
      <CalcButton
        onClick={onPercent}
        className={functionStyle}
        ariaLabel="パーセント">
        %
      </CalcButton>
      <CalcButton
        onClick={() => onOperator("÷")}
        className={operatorStyle}
        ariaLabel="割り算">
        ÷
      </CalcButton>

      {/* 数字と演算子 */}
      <CalcButton
        onClick={() => onDigit("7")}
        className={numberStyle}
        ariaLabel="7">
        7
      </CalcButton>
      <CalcButton
        onClick={() => onDigit("8")}
        className={numberStyle}
        ariaLabel="8">
        8
      </CalcButton>
      <CalcButton
        onClick={() => onDigit("9")}
        className={numberStyle}
        ariaLabel="9">
        9
      </CalcButton>
      <CalcButton
        onClick={() => onOperator("×")}
        className={operatorStyle}
        ariaLabel="掛け算">
        ×
      </CalcButton>

      <CalcButton
        onClick={() => onDigit("4")}
        className={numberStyle}
        ariaLabel="4">
        4
      </CalcButton>
      <CalcButton
        onClick={() => onDigit("5")}
        className={numberStyle}
        ariaLabel="5">
        5
      </CalcButton>
      <CalcButton
        onClick={() => onDigit("6")}
        className={numberStyle}
        ariaLabel="6">
        6
      </CalcButton>
      <CalcButton
        onClick={() => onOperator("-")}
        className={operatorStyle}
        ariaLabel="引き算">
        -
      </CalcButton>

      <CalcButton
        onClick={() => onDigit("1")}
        className={numberStyle}
        ariaLabel="1">
        1
      </CalcButton>
      <CalcButton
        onClick={() => onDigit("2")}
        className={numberStyle}
        ariaLabel="2">
        2
      </CalcButton>
      <CalcButton
        onClick={() => onDigit("3")}
        className={numberStyle}
        ariaLabel="3">
        3
      </CalcButton>
      <CalcButton
        onClick={() => onOperator("+")}
        className={operatorStyle}
        ariaLabel="足し算">
        +
      </CalcButton>

      {/* 最後の行 */}
      <CalcButton
        onClick={() => onDigit("0")}
        className={`${numberStyle} col-span-2`}
        ariaLabel="0">
        0
      </CalcButton>
      <CalcButton
        onClick={onDecimal}
        className={numberStyle}
        ariaLabel="小数点">
        .
      </CalcButton>
      <CalcButton
        onClick={onEquals}
        className={operatorStyle}
        ariaLabel="イコール">
        =
      </CalcButton>
    </div>
  );
}
