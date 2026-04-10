# requirements.md — 優先度機能追加（バックエンド）

## 変更・追加する機能の説明

TodoにPriority（優先度）を登録・取得できるようにする。
優先度はマスタテーブル（`priorities`）で管理し、名前・表示色を設定可能にする。
Todoは `priority_id` で優先度を参照する。

## ユーザーストーリー

- ユーザーとして、Todo作成時に優先度（高/中/低）を任意で指定したい
- ユーザーとして、Todo更新時に優先度を変更したい
- ユーザーとして、Todo一覧取得時に各Todoの優先度情報（名前・文字色・背景色）を受け取りたい
- ユーザーとして、優先度の選択肢一覧を取得したい

## 受け入れ条件

- `GET /api/priorities` で論理削除されていない優先度一覧が `display_order` 昇順で返る
- `POST /api/todos` リクエストに `priorityId` を含められる（任意）
- `PUT /api/todos/{id}` リクエストに `priorityId` を含めて更新できる
- `GET /api/todos` のレスポンスに `priority` オブジェクト（id / name / foregroundColor / backgroundColor）がネストされる
- `priorityId` を省略した場合、`priority` は null になる
- 優先度マスタが論理削除されてもTodoは削除されない（ON DELETE SET NULL）
- 初期データとして 高（001）・中（002）・低（003）が投入される

## 制約事項

- マスタ画面（CRUD UI）は今回対象外
- フィルター・ソートは今回対象外
- 既存Todoの `priority_id` は NULL のまま（マイグレーションで既存データへの値設定は行わない）
