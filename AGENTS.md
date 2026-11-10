<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 電卓アプリ開発ガイド

## 守る設計

- 計算・状態・キー入力は [src/components/Calculator.tsx](src/components/Calculator.tsx) に集約する。`display`、`prevValue`、`operator`、`expression`、`waitingForOperand` の遷移を一緒に確認する。
- 算術演算は decimal.js を使う。数値文字列を安易に JavaScript の `number` に変換しない。
- 現在の結果表示は小数点以下最大10桁。ゼロ除算・無効入力は `Error`、無効なキー入力は無視する。
- キー処理の変更時は数字、演算子、Enter / =、Escape / C、Backspace と `preventDefault()` の扱いを確認する。

## コンポーネント・スタイル

- `Display.tsx` は結果・式と文字数に応じたフォントサイズを担当する。
- `KeyPad.tsx` はボタングリッド、`KeyboardShortcutInfo.tsx` はキー割り当ての説明を担当する。キー追加時は両方を更新する。
- Props は明示的な TypeScript interface で定義し、strict 設定を保つ。`@/*` は `src/*` を指す。
- 色は `src/app/globals.css` の CSS カスタムプロパティを使い、Tailwind v4 の `bg-(--display-bg)` などで参照する。
- 既存のレスポンシブ表示とキーボード操作・読み上げ対応を保つ。

## 検証

パッケージ管理は pnpm。変更に応じて次を実行する。

```bash
pnpm lint
pnpm exec playwright install --with-deps chromium
pnpm build
pnpm test
```

`playwright.config.ts` は `pnpm start` を起動するため事前ビルドが必要。`tests/calculator-*.spec.ts` の基本演算・境界値・高度な機能・表示のテストを使う。実行できなかった検証は理由を報告する。

## 文書の管理

セットアップと使い方は [README.md](README.md) を参照。開発時の指示はこのファイルで管理し、実装・設定・コマンドを変更した場合は関連する説明も更新する。依存バージョンとスクリプトは `package.json`、詳細設定は各設定ファイルを正とする。
