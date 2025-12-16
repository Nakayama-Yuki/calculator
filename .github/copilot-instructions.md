# 電卓アプリ - AI コーディング指示書

## プロジェクト概要

Next.js 16、React 19、TypeScript で構築されたモダンなウェブ電卓です。decimal.js を使用して IEEE754 浮動小数点誤差を解消した**高精度計算**が最大の特徴。Tailwind CSS v4 による responsive UI と、キーボードショートカット対応のアクセシビリティを備えています。

## コアアーキテクチャ

### 単一の状態管理スキーム（Calculator.tsx）

[Calculator.tsx](src/components/Calculator.tsx) が全計算機の状態を一元管理：

- `display`: 現在表示中の値または計算結果
- `prevValue`: 演算子押下時の値
- `operator`: 選択中の演算子（+, -, ×, ÷）
- `expression`: 式全体（Display用）
- `waitingForOperand`: 演算子直後の入力判定フラグ

### コンポーネント責務

| ファイル                                                            | 役割                                      | 依存関係                              |
| ------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------- |
| [Calculator.tsx](src/components/Calculator.tsx)                     | 状態管理、計算ロジック、キーボード処理    | Display, KeyPad, KeyboardShortcutInfo |
| [Display.tsx](src/components/Display.tsx)                           | 結果と履歴式の表示（動的フォントサイズ）  | -                                     |
| [KeyPad.tsx](src/components/KeyPad.tsx)                             | UI ボタングリッド、クリックハンドラー提供 | CalcButton 内部コンポーネント         |
| [KeyboardShortcutInfo.tsx](src/components/KeyboardShortcutInfo.tsx) | キーボードショートカットツールチップ      | -                                     |

## 必須実装パターン

### Decimal.js による計算（全ての算術演算で必須）

```typescript
// 浮動小数点誤差を回避。常に Decimal インスタンスを使用
function calculate(
  firstValue: string,
  secondValue: string,
  operator: string,
): string {
  try {
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
        if (second.isZero()) return "Error";
        result = first.dividedBy(second);
        break;
      default:
        return secondValue;
    }

    // 精度制限：10 小数点以下に制限
    return result.toFixed(
      result.decimalPlaces() > 10 ? 10 : result.decimalPlaces(),
    );
  } catch (error) {
    console.error("計算エラー:", error);
    return "Error";
  }
}
```

### キーボードイベント処理（useEffect + preventDefault）

[Calculator.tsx #225-293](src/components/Calculator.tsx#L225-L293) の `useEffect` でグローバルキーボードリッスン：

- 数字キー (0-9)：`handleDigit()`
- 演算子：`+`, `-`, `*`(→×), `/`(→÷)
- Enter/=：`handleEquals()`
- Escape/C：`handleClear()`
- Backspace：`handleBackspace()`
- **重要**：ArrowUp/Down/Left/Right, /, \*, +, - で `preventDefault()` 実行

### CSS 変数カスタムプロパティ（Tailwind v4 との統合）

[globals.css](src/app/globals.css) で定義：

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
  --calculator-bg: #f3f4f6;
  --button-number-bg: #4b5563;
  --button-function-bg: #6b7280;
  --button-operator-bg: #f59e0b;
  --display-bg: #1f2937;
}
```

Tailwind で参照：`bg-(--display-bg)` フォーマット使用

### 動的フォントサイズ（Display コンポーネント）

[Display.tsx](src/components/Display.tsx) で `getFontSizeClass()` 実装：

- 値の長さ > 12 文字：text-2xl
- 値の長さ > 8 文字：text-3xl
- デフォルト：text-4xl

式も同様に `getExpressionFontSizeClass()` で調整

### プロップ定義の明示的 TypeScript インターフェース

全コンポーネント先頭で定義（例）：

```typescript
interface DisplayProps {
  value: string;
  expression: string;
}
```

## 開発ワークフロー

### コマンド

```bash
pnpm dev              # 開発サーバー（http://localhost:3000）
pnpm build            # プロダクションビルド
pnpm lint             # ESLint
pnpm test             # Playwright テスト（未実装、tests/ に例あり）
```

### パッケージ管理

- **pnpm**
- 主要依存関係：[decimal.js ^10.6.0](package.json)、Tailwind CSS v4.1、React 19

### TypeScript 設定

[tsconfig.json](tsconfig.json)：

- target: ES2024
- strict: true（有効）
- paths: `@/*` → `./src/*`

## 重要な注意点

### 2. テスト

- [tests/example.spec.ts](tests/example.spec.ts) はプレイスホルダー（playwright.dev 対象）
- 電卓アプリのテストは未実装：要 Playwright または Jest で新規作成

### 3. エラーハンドリング

- ゼロ除算 → "Error" 表示
- 無効な Decimal 入力 → "Error" 表示
- キーボード入力の無効キーは無視（switch default）

## クイックリファレンス

**新機能追加フロー：**

1. Calculator.tsx に状態・ハンドラーを追加
2. KeyPad または KeyboardShortcutInfo で UI/キー割り当てを追加
3. Display に新情報が必要なら更新
4. globals.css に CSS 変数が必要なら追加

**バグ修正フロー：**

1. 計算誤差 → calculate() 関数の Decimal 操作確認
2. キーボード未反応 → useEffect の keydown ハンドラー確認
3. 表示崩れ → Display の getFontSizeClass() またはボタンの Tailwind クラス確認
