# WebアプリCIの共通テンプレート

`generate.py` で10アプリのGitHub Actionsを生成します。各リポジトリには生成済みYAMLを置くため、単独でcloneしてCIを実行できます。共通生成元はcalculatorリポジトリの `tools/web-ci/` で管理します。

```bash
cd /home/yuki/projects_web
python3 calculator/tools/web-ci/generate.py
python3 calculator/tools/web-ci/generate.py --check
```

共通のセットアップ・キャッシュ・実行順・レポート設定は生成スクリプトを変更して再生成します。既存のワークフロー名・ジョブIDを維持し、DB・ブラウザ種類などの差だけをアプリ別に設定します。変更したYAMLは各アプリのリポジトリでレビュー・コミットしてください。

- 通常CI: 型・lint → DB初期化とDB検証（Todo系）→ 本番build → 必要ブラウザのインストール → 本番E2E → レポート保存。
- 全アプリ: `packageManager` のpnpmバージョン、lockfile必須、30分の上限、古い実行のキャンセルを統一。
- 外部APIを使う必須E2E: 専用Nodeプロセスに `tests/mock-fetch.mjs` を読み込み、サーバー側fetchの応答を固定。通常の `pnpm build` / `pnpm start` は実APIを使う。
- 実API疎通: EC・天気・レシピの `Live API smoke test` を手動実行。天気・レシピだけAPIキーのSecretsが必要。
- Docker CI: Docker・ソース・依存設定変更時にイメージをbuildしてHTTP起動を確認。Todo系は一時PostgreSQLサービスも用意。

GitHub側の実行結果・ブランチ保護・APIキーの設定は、このローカルの生成検査では確認できません。

calculatorだけをcloneした場合は、リポジトリ名を `calculator` として次を実行できます。

```bash
python3 tools/web-ci/generate.py --root .. --app calculator --check
```

`--root` は各アプリを置いた親ディレクトリ、`--app` は単一アプリの選択です。全体のローカル検証結果は [verification.md](verification.md) を参照してください。
