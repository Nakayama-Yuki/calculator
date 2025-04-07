"use client";

import { useState } from "react";
import Display from "@/components/Display";
import KeyPad from "@/components/KeyPad";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * 計算機のメインコンポーネント
 * ディスプレイと数字キーパッドを統合し、計算ロジックを管理します
 */
export default function Calculator() {
  // テーマコンテキストから現在のテーマを取得
  const { theme } = useTheme();

  // 計算機の現在の表示値
  const [display, setDisplay] = useState<string>("0");
  // 前の数値を保持
  const [prevValue, setPrevValue] = useState<string | null>(null);
  // 選択された演算子
  const [operator, setOperator] = useState<string | null>(null);
  // 演算子が選択された後かどうか
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  /**
   * 数字キーが押された時の処理
   * @param digit - 押された数字
   */
  const handleDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  /**
   * 小数点ボタンが押された時の処理
   */
  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  /**
   * 演算子ボタンが押された時の処理
   * @param nextOperator - 選択された演算子
   */
  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(display);
    } else if (operator) {
      const result = calculate(parseFloat(prevValue), inputValue, operator);
      setDisplay(String(result));
      setPrevValue(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  /**
   * 計算処理
   * @param firstValue - 最初の値
   * @param secondValue - 二番目の値
   * @param operator - 演算子
   * @returns 計算結果
   */
  const calculate = (
    firstValue: number,
    secondValue: number,
    operator: string
  ): number => {
    switch (operator) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      default:
        return secondValue;
    }
  };

  /**
   * イコールボタンが押された時の処理
   */
  const handleEquals = () => {
    if (prevValue === null || operator === null) {
      return;
    }

    const inputValue = parseFloat(display);
    const result = calculate(parseFloat(prevValue), inputValue, operator);

    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  /**
   * クリアボタン(C)が押された時の処理
   */
  const handleClear = () => {
    setDisplay("0");
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  /**
   * 全クリアボタン(AC)が押された時の処理
   */
  const handleAllClear = () => {
    handleClear();
  };

  /**
   * パーセントボタンが押された時の処理
   */
  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  /**
   * +/-ボタンが押された時の処理
   */
  const handleToggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  };

  return (
    <div className="bg-[var(--calculator-bg)] p-6 rounded-2xl shadow-2xl max-w-xs mx-auto transition-colors duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-medium">電卓</h1>
        <ThemeToggle />
      </div>
      <Display value={display} />
      <KeyPad
        onDigit={handleDigit}
        onDecimal={handleDecimal}
        onOperator={handleOperator}
        onEquals={handleEquals}
        onClear={handleClear}
        onAllClear={handleAllClear}
        onPercent={handlePercent}
        onToggleSign={handleToggleSign}
      />
    </div>
  );
}
