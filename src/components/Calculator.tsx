"use client";

import { useState, useEffect, useRef } from "react";
import Display from "@/components/Display";
import KeyPad from "@/components/KeyPad";
import ThemeToggle from "@/components/ThemeToggle";
import Decimal from "decimal.js";

/**
 * 計算機のメインコンポーネント
 * ディスプレイと数字キーパッド、キーボード入力対応を統合し、decimal.jsを使用して正確な計算ロジックを管理します
 * @returns {JSX.Element} 計算機コンポーネント
 */

export default function Calculator() {
  // 計算機の現在の表示値
  const [display, setDisplay] = useState<string>("0");
  // 前の数値を保持
  const [prevValue, setPrevValue] = useState<string | null>(null);
  // 選択された演算子
  const [operator, setOperator] = useState<string | null>(null);
  // 演算子が選択された後かどうか
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  // 計算式全体を表示するための状態
  const [expression, setExpression] = useState<string>("");
  // ツールチップの表示状態
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  // ツールチップの参照
  const tooltipRef = useRef<HTMLDivElement>(null);

  /**
   * ツールチップの表示/非表示を切り替える関数
   */
  function toggleTooltip() {
    setShowTooltip((prev) => !prev);
  }

  /**
   * ツールチップ外のクリックを検出して非表示にする
   */
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * キーボード入力イベントをリッスンするためのエフェクト
   * キー入力に応じて適切な電卓操作を実行します
   */
  useEffect(() => {
    // キーボードイベントハンドラー
    function handleKeyDown(event: KeyboardEvent) {
      // イベントの伝播を防止（ページのスクロールなどを防ぐため）
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "/",
          "*",
          "+",
          "-",
        ].includes(event.key)
      ) {
        event.preventDefault();
      }

      // 数字キー (0-9)
      if (/^[0-9]$/.test(event.key)) {
        handleDigit(event.key);
        return;
      }

      // 演算子
      switch (event.key) {
        case "+":
          handleOperator("+");
          break;
        case "-":
          handleOperator("-");
          break;
        case "*":
          handleOperator("×");
          break;
        case "/":
          handleOperator("÷");
          break;
        case ".":
        case ",":
          handleDecimal();
          break;
        case "Enter":
        case "=":
          handleEquals();
          break;
        case "Escape":
        case "c":
        case "C":
          handleClear();
          break;
        case "%":
          handlePercent();
          break;
        case "Backspace":
          handleBackspace();
          break;
        default:
          break;
      }
    }

    // キーボードイベントリスナーを追加
    window.addEventListener("keydown", handleKeyDown);

    // クリーンアップ関数
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [display, prevValue, operator, waitingForOperand]); // 依存配列に状態変数を追加

  /**
   * バックスペースキーの処理 - 入力値を一文字ずつ削除
   */
  function handleBackspace() {
    if (display === "0" || display === "Error" || waitingForOperand) {
      return;
    }

    // 最後の文字を削除
    const newDisplay = display.length > 1 ? display.slice(0, -1) : "0";
    setDisplay(newDisplay);
  }

  /**
   * 数字キーが押された時の処理
   * @param digit - 押された数字
   */
  function handleDigit(digit: string) {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  }

  /**
   * 小数点ボタンが押された時の処理
   */
  function handleDecimal() {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }

  /**
   * 演算子ボタンが押された時の処理
   * @param nextOperator - 選択された演算子
   */
  function handleOperator(nextOperator: string) {
    // 現在の表示値を取得
    const inputValue = display;

    if (prevValue === null) {
      setPrevValue(display);
      // 式の更新: 最初の数値と演算子
      setExpression(`${display} ${nextOperator} `);
    } else if (operator) {
      // decimal.jsを使用して計算
      const result = calculate(prevValue, inputValue, operator);
      setDisplay(result);
      setPrevValue(result);
      // 式の更新: 計算結果と次の演算子
      setExpression(`${result} ${nextOperator} `);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  }

  /**
   * decimal.jsを使用した正確な計算処理
   * IEEE754の浮動小数点数の丸め誤差を解消します
   *
   * @param firstValue - 最初の値（文字列）
   * @param secondValue - 二番目の値（文字列）
   * @param operator - 演算子
   * @returns 計算結果（文字列）
   */
  function calculate(
    firstValue: string,
    secondValue: string,
    operator: string
  ): string {
    try {
      // decimal.jsを使用して精度の高い計算を行う
      const first = new Decimal(firstValue);
      const second = new Decimal(secondValue);

      let result: Decimal;

      switch (operator) {
        case "+":
          result = first.plus(second);
          break;
        case "-":
          result = first.minus(second);
          break;
        case "×":
          result = first.times(second);
          break;
        case "÷":
          // 0での除算チェック
          if (second.isZero()) {
            return "Error";
          }
          result = first.dividedBy(second);
          break;
        default:
          return secondValue;
      }

      // 科学的表記を避け、適切にフォーマット（10桁以上の場合は10桁に制限）
      return result.toFixed(
        result.decimalPlaces() > 10 ? 10 : result.decimalPlaces()
      );
    } catch (error) {
      console.error("計算エラー:", error);
      return "Error";
    }
  }

  /**
   * イコールボタンが押された時の処理
   * decimal.jsを使用して最終的な計算を実行します
   */
  function handleEquals() {
    if (prevValue === null || operator === null) {
      return;
    }

    const inputValue = display;
    const result = calculate(prevValue, inputValue, operator);

    // 式の更新: 完全な計算式と結果
    setExpression(`${prevValue} ${operator} ${display} = ${result}`);

    setDisplay(result);
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  }

  /**
   * クリアボタン(C)が押された時の処理
   */
  function handleClear() {
    setDisplay("0");
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression("");
  }

  /**
   * パーセントボタンが押された時の処理
   * decimal.jsを使用して正確なパーセント計算を行います
   */
  function handlePercent() {
    try {
      const value = new Decimal(display);
      const result = value.dividedBy(100).toString();
      setDisplay(result);
      // パーセント計算を式に反映
      if (expression && prevValue !== null) {
        setExpression(`${expression}(${display}%) `);
      } else {
        setExpression(`${display}% `);
      }
    } catch (error) {
      console.error("パーセント計算エラー:", error);
      setDisplay("Error");
    }
  }

  /**
   * +/-ボタンが押された時の処理
   * decimal.jsを使用して正確な符号反転を行います
   */
  function handleToggleSign() {
    try {
      const value = new Decimal(display);
      const result = value.negated().toString();
      setDisplay(result);

      // 符号反転を式に反映
      if (waitingForOperand && expression) {
        // 式の最後を更新
        setExpression(expression.trimEnd() + " ");
      }
    } catch (error) {
      console.error("符号反転エラー:", error);
      setDisplay("Error");
    }
  }

  return (
    <div className="bg-[var(--calculator-bg)] p-6 rounded-2xl shadow-2xl max-w-xs mx-auto transition-colors duration-300 ease-in-out dark:shadow-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-medium">電卓</h1>
        <div className="flex items-center gap-2">
          {/* キーボードショートカット情報アイコン */}
          <div className="relative">
            <button
              onClick={toggleTooltip}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="キーボードショートカット情報">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </button>

            {/* ツールチップ */}
            {showTooltip && (
              <div
                ref={tooltipRef}
                className="absolute right-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 min-w-[200px] text-xs"
                role="tooltip">
                <h3 className="font-medium text-sm mb-1">
                  キーボードでも操作できます:
                </h3>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
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
          <ThemeToggle />
        </div>
      </div>
      <Display value={display} expression={expression} />
      <KeyPad
        onDigit={handleDigit}
        onDecimal={handleDecimal}
        onOperator={handleOperator}
        onEquals={handleEquals}
        onClear={handleClear}
        onPercent={handlePercent}
        onToggleSign={handleToggleSign}
      />
    </div>
  );
}
