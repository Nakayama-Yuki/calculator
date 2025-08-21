# 電卓アプリ - AI コーディング指示書

## プロジェクト概要

Next.js 15、React 19、TypeScript で構築されたモダンなウェブ電卓です。decimal.js を使用して IEEE754 浮動小数点誤差を解消した高精度計算を特徴とし、Tailwind CSS v4 によるダーク/ライトテーマ対応と包括的なキーボードアクセシビリティを備えています。

## アーキテクチャと主要コンポーネント

### コアアーキテクチャパターン

- **単一状態コンテナ**: `Calculator.tsx`が全ての計算状態（display, prevValue, operator, expression）を管理
- **コンポーネント構成**: Display + KeyPad + ThemeToggle コンポーネントの明確なプロップインターフェース
- **コンテキストベースのテーマ**: `ThemeContext`が localStorage 永続化付きグローバルテーマ状態を提供

### 重要なコンポーネント

- `Calculator.tsx` - decimal.js 計算ロジック付きメイン状態管理
- `Display.tsx` - コンテンツ長に基づく動的フォントサイジング
- `KeyPad.tsx` - 一貫したスタイリングのグリッドベースボタンレイアウト
- `ThemeContext.tsx` - システム設定検出付きテーマ状態

## 必須開発パターン

### 計算ロジック（decimal.js）

```typescript
// 浮動小数点誤差を避けるため、計算には必ずDecimalを使用
const result = new Decimal(firstValue).plus(new Decimal(secondValue));
return result.toFixed(
  result.decimalPlaces() > 10 ? 10 : result.decimalPlaces()
);
```

### テーマ用 CSS 変数

```css
:root {
  --button-number-bg: #4b5563;
  --button-operator-bg: #f59e0b;
  --display-bg: #1f2937;
}
.dark {
  /* ダークモードのオーバーライド */
}
```

### コンポーネントプロップパターン

全てのコンポーネントが明確なプロップ定義付きの明示的 TypeScript インターフェースを使用（例：`DisplayProps`, `KeyPadProps`）

## 開発ワークフロー

### コマンド

- `pnpm dev --turbopack` - Turbopack 付き開発サーバー
- `pnpm build` - プロダクションビルド
- `pnpm lint` - Next.js 設定付き ESLint

### パッケージ管理

- **pnpm**を使用（npm/yarn ではない）
- 主要依存関係: 計算用 decimal.js、Tailwind CSS v4

## 主要実装詳細

### 状態管理

- 電卓状態は`Calculator.tsx`で複数の useState フックを使用して集約管理
- 計算履歴表示のための式追跡
- 適切な演算子チェーンのための`waitingForOperand`フラグ

### キーボードサポート

- 矢印キーの preventDefault を含む`useEffect`での完全なキーボードイベント処理
- キーボード入力を電卓機能にマッピング（数字、演算子、Enter、Escape）

### スタイリングアプローチ

- テーマ変数の CSS カスタムプロパティ
- CSS 変数フォールバック付き Tailwind ユーティリティクラス
- コンテンツ長に基づく動的フォントサイジング
- ボタン配置のグリッドレイアウト

### エラーハンドリング

- 全ての decimal.js 操作の try-catch ブロック
- ゼロ除算の検出
- 無効な計算の"Error"表示状態

## ファイル構造コンテキスト

- `src/app/` - Next.js App Router ページとレイアウト
- `src/components/` - 再利用可能 UI コンポーネント
- `src/contexts/` - React Context プロバイダー
- `globals.css`の CSS カスタムプロパティでのテーマ設定

## テストと開発ノート

- 全ての数値演算で decimal.js を必須使用
- テーマ変更は localStorage に永続化必須
- 全機能でキーボードアクセシビリティが必須
- ボタン状態には hover、active、focus スタイルを含む
