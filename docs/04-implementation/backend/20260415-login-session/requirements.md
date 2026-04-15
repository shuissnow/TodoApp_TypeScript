# requirements.md — ログイン機能追加（バックエンド）

## 変更・追加する機能の説明

セッション（Cookie 認証）を用いたログイン機能をバックエンドに追加する。
ASP.NET Core の `AddAuthentication().AddCookie()` を使用し、認証済み Cookie を発行することでセッションを管理する。
ユーザーはシードデータとして DB に登録した固定ユーザーのみとする。

## ユーザーストーリー

- ユーザーとして、ユーザー名とパスワードでログインしたい
- ユーザーとして、ログアウトしてセッションを破棄したい
- ユーザーとして、現在ログイン中のユーザー情報を取得したい
- ユーザーとして、自分の Todo のみを参照・操作したい（他のユーザーのデータには触れない）

## 受け入れ条件

- `POST /api/auth/login` に正しい認証情報を送ると `200 OK` + `Set-Cookie` ヘッダーが返る
- `POST /api/auth/login` に誤った認証情報を送ると `401 Unauthorized` が返る
- `POST /api/auth/logout` を呼び出すと Cookie が破棄され、以降のリクエストは `401` になる
- `GET /api/auth/me` はログイン済み状態で `200 OK + { id, username }` を返す
- `GET /api/todos`・`POST /api/todos` 等の Todo 系エンドポイントは未認証で `401 Unauthorized` を返す
- Todo 系エンドポイントはログイン済みユーザーの Todo のみを対象とする（他ユーザーの Todo には触れない）
- 優先度マスタ（`/api/priorities`）は全ユーザー共通のまま変更なし
- アプリ起動時にシードユーザー（admin）が存在しない場合は自動作成される
- パスワードは平文で保存せず、`PasswordHasher<User>` でハッシュ化して DB に保存する

## 制約事項

- ユーザー登録（サインアップ）機能は今回スコープ外
- セッションストアは Cookie（クライアントサイド）のみ。Redis / DB セッションは不使用
- 開発環境では `SameSite=Lax`、`Secure=false` の設定とする
- 既存の Todo データはマイグレーション時にシードユーザーへ自動移行する
