# CI改善の検証結果

対象: `/home/yuki/projects_web` の10アプリ。実施日: 2026-11-18（日本時間）。変更はローカルの各リポジトリに適用。

| アプリ | frozen install | 型・lint | 本番build | E2E |
| --- | --- | --- | --- | --- |
| PomodoroTimer | 成功 | 成功 | 成功 | 7件成功 |
| calculator | 成功 | 成功 | 成功 | 64件成功 |
| chatapp6 | 成功 | 成功 | 成功 | 3件成功 |
| ec-product-list2 | 成功 | 成功 | 成功 | 10件成功 |
| recipe-search2 | 成功 | 成功 | 成功 | 2件成功 |
| tic-tac-toe | 成功 | 成功 | 成功 | 70件成功 |
| todoapp | 成功 | 成功 | 成功 | 21件成功 |
| todoapp-rr | 成功 | 成功 | 成功 | 44件成功 |
| weatherapp | 成功 | 成功 | 成功 | 4件成功 |
| weatherapp-rr | 成功 | 成功 | 成功 | 2件成功 |

E2E合計: **227件成功**。TodoのDB初期化検証2件、所有者分離・DB障害復旧4件も成功。

## 適用した変更

- 生成されたPlaywrightレポート・トレース・テスト結果はlint対象から除外。
- 全10アプリ: pnpm 12.21.0固定、lockfile必須、型・lint → build → 必要ブラウザ準備 → 本番E2Eの順序、古いCIの中止、30分の上限。
- DB: Todo系は一時PostgreSQLの固定認証情報とヘルスチェックを使用し、Secrets依存を解消。
- E2E: ECの既存10件を再有効化。チャット・レシピ・天気React Routerに計7件を追加。三目並べとTodo React Routerは本番サーバーを検証。
- 外部API: テスト専用Nodeプロセスのfetchを固定。EC・天気・レシピの実API疎通は手動ワークフローへ分離。
- Docker: 3アプリにビルド・HTTP起動の検証ワークフローを追加。pnpm導入、lockfile整合性、Todoのstandalone出力を修正。
- 共通化: `generate.py` から独立動作するYAMLを生成。生成一致チェックとactionlint 1.7.12による全16ワークフローの検証に成功。
- EC: ビルドを停止させたNext.jsの既知脆弱性に対応し、Next.jsとESLintプラグインを16.4.3から16.4.6へ固定更新。`pnpm audit --prod` の検出は更新後0件。

## 検証環境と限界

- Node.js 26.13.1 / pnpm 12.21.0。tic-tac-toeのCI設定は既存のNode.js 24指定を維持し、Node.js 24での実行はGitHub側で未確認。
- Todo系は `/tmp` に用意した検証専用PostgreSQL 18を使用。todoapp-rrのGitHub CIは既存のPostgreSQL 17を維持し、17での実行は未確認。既存DBは使用していない。
- WebKitはWSLの不足ライブラリを `/tmp` に展開し、一時ラッパーと一時Playwright設定で同じ70テストを実行。ブラウザ本体・アプリのテスト・CIの起動方法は標準のまま。
- Docker DesktopのWSL統合が利用できず、Dockerイメージの実ビルド・実起動は未検証。Todoのstandalone/server.js生成はローカルbuildで確認。
- 実APIとの疎通、実Supabaseのログイン成功・Realtime・プロフィール更新、GitHub上のActions実行・ブランチ保護は未検証。
- Next.jsによる意図しないtsconfig.jsonの整形・strict追記は元に戻した。pnpmの固定情報によるlockfile更新は保持。
