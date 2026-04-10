# tasklist.md — 優先度機能追加（フロントエンド）

## タスク一覧

### 1. 型定義

- [x] `types/todo.ts`: `Priority` を string union から interface に変更

### 2. API サービス

- [x] `services/api.ts`: `fetchPriorities` 追加
- [x] `services/api.ts`: `createTodo` に `priorityId?: string` 追加
- [x] `services/api.ts`: `updateTodo` の patch 型に `priorityId?: string | null` 追加

### 3. ユーティリティ・定数

- [x] `utils/uiHelpers.ts`: `createPriorityBadge` を Priority オブジェクト対応に更新
- [x] `utils/domIds.ts`: `TODO_PRIORITY_SELECT` 追加

### 4. atoms

- [x] `components/atoms/PrioritySelect.ts`: 新規作成

### 5. molecules / organisms

- [x] `components/molecules/TodoInput.ts`: `PrioritySelect` 追加、`priorities` 引数追加
- [x] `components/organisms/TaskListView.ts`: 優先度列インライン編集追加、`priorities` 引数追加
- [x] `components/organisms/TaskBoardView.ts`: 型変更への追従確認

### 6. app.ts

- [x] `app.ts`: `priorities` 状態追加、`fetchPriorities` 呼び出し（並列フェッチ）
- [x] `app.ts`: `addTodo` に `priorityId` 引数追加
- [x] `app.ts`: `updatePriority` 関数追加
- [x] `app.ts`: `render()` で `priorities` を各コンポーネントに渡す
- [x] `app.ts`: `setupEventListeners` に優先度インライン編集イベント追加

### 7. テスト

- [x] `test/utils/uiHelpers.test.ts`: Priority オブジェクトベースに書き換え
- [x] `test/services/api.test.ts`: `fetchPriorities` / `priorityId` テスト追加
- [x] `test/components/atoms/PrioritySelect.test.ts`: 新規作成
- [x] `test/components/molecules/TodoInput.test.ts`: `priorities` 引数対応に更新
- [x] `test/components/organisms/TaskListView.test.ts`: 優先度表示・インライン編集テスト追加
- [x] `test/components/organisms/TaskBoardView.test.ts`: 優先度バッジ表示テスト確認

### 8. 動作確認

- [x] `npm run build` でビルドエラーなし
- [x] `npm test` で全テストパス（210件）
- [ ] Docker 起動後、Todo 作成フォームに PrioritySelect が表示される
- [ ] 優先度を選択して追加 → テーブル・ボードに優先度バッジが表示される
- [ ] テーブルビューで優先度バッジをクリック → select に切り替わり更新できる
- [ ] `priority = null` の既存 Todo が「低」バッジで表示される

## 完了条件

- 全タスクが完了していること
- `npm run build` / `npm test` がエラーなしでパスすること
