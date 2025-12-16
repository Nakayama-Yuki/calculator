# 電卓アプリ

## 概要

ウェブ技術を使用した、使いやすい電卓アプリです。IEEE754 の浮動小数点数の計算誤差を解消し、より正確な計算結果を提供します。Tailwind CSS v4 による responsive UI とキーボードショートカット対応のアクセシビリティを備えています。

## 特徴

- **高精度な計算**: [decimal.js](https://github.com/MikeMcl/decimal.js/) を使用し、浮動小数点数の計算誤差を解消
- **モダンな UI**: Tailwind CSS v4 によるデザイン
- **キーボードショートカット**: 数字キー、演算子、Enter、Escape など全対応
- **基本演算**: 足し算、引き算、掛け算、割り算
- **式の履歴表示**: 入力式と計算結果を同時表示
- **動的フォントサイズ**: 表示内容に応じたレスポンシブレイアウト

## 技術スタック

- **フロントエンド**: Next.js 16, React 19, TypeScript
- **スタイリング**: Tailwind CSS
- **パッケージ管理**: pnpm
- **数値計算**: decimal.js

## 始め方

### 必要条件

- Node.js 18 以上
- pnpm 8 以上

### インストール手順

1. リポジトリをクローン：

```bash
git clone https://github.com/yourusername/calculator.git
cd calculator
```

2. 依存関係をインストール：

```bash
pnpm install
```

3. 開発サーバーを起動：

```bash
pnpm dev
```

4. ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスして電卓アプリを使用

## プロジェクト構成

```
src/
  ├── app/
  │   ├── layout.tsx          # ルートレイアウト
  │   ├── page.tsx            # メインページ
  │   └── globals.css         # グローバルスタイル（CSS 変数定義）
  └── components/             # コンポーネント
      ├── Calculator.tsx       # 電卓のメインコンポーネント（状態管理・ロジック）
      ├── Display.tsx         # 計算結果と式を表示（動的フォントサイズ）
      ├── KeyPad.tsx          # 電卓のボタン配置
      └── KeyboardShortcutInfo.tsx # キーボードショートカットツールチップ
```
