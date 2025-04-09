# 電卓アプリ

## 概要

ウェブ技術を使用した、使いやすい電卓アプリです。IEEE754 の浮動小数点数の計算誤差を解消し、より正確な計算結果を提供します。ダークモードにも対応した UI デザインを備えています。

## 特徴

- **高精度な計算**: [decimal.js](https://github.com/MikeMcl/decimal.js/) を使用し、浮動小数点数の計算誤差を解消
- **モダンな UI**: Tailwind CSS v4 によるデザイン
- **ダークモード**: システム設定に合わせた自動切り替え、または手動切り替え
- **高度な機能**:
  - 基本演算（足し算、引き算、掛け算、割り算）
  - パーセント計算
  - 符号反転（+/-）
  - 式の履歴表示

## 技術スタック

- **フロントエンド**: Next.js,React,TypeScript
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
  │   ├── layout.tsx    # ルートレイアウト
  │   ├── page.tsx      # メインページ
  │   └── globals.css   # グローバルスタイル
  ├── components/       # コンポーネント
  │   ├── Calculator.tsx # 電卓のメインコンポーネント
  │   ├── Display.tsx   # 計算結果と式を表示
  │   ├── KeyPad.tsx    # 電卓のボタン配置
  │   └── ThemeToggle.tsx # ダークモード切替
  └── contexts/         # コンテキスト
      └── ThemeContext.tsx # テーマ状態管理
```

## ライセンス

MIT
