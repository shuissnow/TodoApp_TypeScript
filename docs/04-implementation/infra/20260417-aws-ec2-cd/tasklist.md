# タスクリスト — AWS EC2 CD（自動デプロイ）

**作成日:** 2026-04-17  
**ステータス:** 進行中

---

## Phase 1: AWS リソースのセットアップ（手動）

- [x] EC2 キーペアを作成し、PEM ファイルをローカルに保存する（`Key_TodoApp`）
- [x] Security Group を作成する（SSH: 自分の IP、HTTP: 0.0.0.0/0）
- [x] EC2 インスタンスを起動する（Ubuntu 24.04 LTS / t3.micro）
- [x] Elastic IP を割り当て、EC2 に関連付ける（`52.197.221.82`）
- [x] SSH で EC2 に接続できることを確認する

---

## Phase 2: EC2 初期セットアップ（手動）

- [x] Docker および docker compose plugin をインストールする
- [x] Git をインストールする
- [x] `ubuntu` ユーザーを docker グループに追加する
- [ ] リポジトリを EC2 上にクローンする
- [ ] `.env` ファイルを作成し、DB パスワード・JWT キーを設定する

---

## Phase 3: docker compose 本番設定（実装）

- [ ] `src/docker-compose.prod.yml` を新規作成する
- [ ] フロントエンド用 `Dockerfile.prod` を新規作成する（マルチステージビルド）
- [ ] フロントエンド用 `nginx.conf` を新規作成する
- [ ] EC2 上で `docker compose -f docker-compose.prod.yml up --build -d` が通ることを手動確認する

---

## Phase 4: GitHub Actions CD ワークフロー（実装）

- [ ] GitHub Secrets に `EC2_HOST`・`EC2_USER`・`EC2_SSH_KEY` を登録する
- [ ] `.github/workflows/cd.yml` を新規作成する
- [ ] main に push して CD が自動実行されることを確認する

---

## Phase 5: 動作確認

- [ ] ブラウザで `http://<Elastic IP>` にアクセスしてフロントエンドが表示されることを確認する
- [ ] API が正常に応答することを確認する（ログイン・Todo の CRUD）
- [ ] GitHub Actions のログで CD が成功していることを確認する

---

## Phase 6: 削除（検証後）

- [ ] EC2 インスタンスを終了する
- [ ] Elastic IP を解放する
- [ ] Key Pair を削除する
- [ ] Security Group を削除する
