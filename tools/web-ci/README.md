# WebアプリCIの保守手順

各リポジトリの `.github/workflows/*.yml` を直接編集します。ワークフローは各リポジトリ内で完結し、単独でcloneしてCIを実行できます。

セットアップ・キャッシュ・実行順・レポート設定の変更は、対象アプリのYAMLに反映します。既存のワークフロー名・ジョブIDを維持し、DB・ブラウザ種類などのアプリ固有の設定を確認してください。変更したYAMLは各アプリのリポジトリでレビュー・コミットします。

- 通常CI: 型・lint → DB初期化とDB検証（Todo系）→ 本番ビルド。Playwrightを導入済みの7アプリでは、その後にブラウザの準備・本番E2E・レポート保存も実行。chatapp6・recipe-search2・weatherapp-rrの通常CIは本番ビルドまで実行。
- 全アプリ: `packageManager` のpnpmバージョン、lockfile必須、30分の上限、古い実行のキャンセルを統一。
- 外部APIを使う必須E2E: 専用Nodeプロセスに `tests/mock-fetch.mjs` を読み込み、サーバー側fetchの応答を固定。通常の `pnpm build` / `pnpm start` は実APIを使う。
- 実API疎通: EC・天気・レシピの `Live API smoke test` を手動実行。天気・レシピだけAPIキーのSecretsが必要。
- Docker CI: Docker・ソース・依存設定変更時にイメージをbuildしてHTTP起動を確認。Todo系は一時PostgreSQLサービスも用意。

変更後はactionlintで構文・式・アクションの入力を検査し、対象アプリの依存インストール・型・lint・ビルド・E2Eを変更内容に応じて実行します。GitHub側の実行結果はPRのChecksで確認してください。
