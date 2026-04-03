# TODO

## 本番環境と開発環境でDBを使い分ける

本番環境ではAWS RDS PostgreSQL、開発環境ではローカルのPostgreSQLを使い分けられるようにする。

詳細は会話ログを参照。概要は以下のとおり。

- `appsettings.json` から接続文字列を削除し、`appsettings.Development.json` にローカル用を移動
- `docker-compose.prod.yml` の `backend` サービスに環境変数 `ConnectionStrings__DefaultConnection` を追加
- 本番ではRDS接続情報を ECS タスク定義または AWS Secrets Manager で管理
- `.env.example` に本番用変数（`RDS_HOST`, `RDS_DB`, `RDS_USER`, `RDS_PASSWORD`）を追加

## Makefileを作成する

プロジェクトルートにMakefileを作成し、長いdocker composeコマンドを短いコマンドにまとめる。

- `make up` — 開発環境を起動
- `make down` — コンテナを停止・削除
- `make logs` — ログをリアルタイム表示
- `make ps` — コンテナの起動状態を確認
- `make db` — DBに接続

## skills

## カスタムコマンド

## Github issueに関するFlowを考える

## permissionの設定

