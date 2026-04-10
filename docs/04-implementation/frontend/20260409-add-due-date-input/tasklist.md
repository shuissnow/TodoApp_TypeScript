# tasklist.md — 期限日入力・編集・表示の追加（フロントエンド）

**作成日:** 2026-04-09

---

## タスク一覧

### 1. 型・定数の修正

- [x] `types/todo.ts`: `deadline` → `dueDate` にリネーム
- [x] `utils/domIds.ts`: `TODO_DEADLINE_INPUT` セレクターを追加

### 2. API レイヤーの修正

- [x] `services/api.ts`: `createTodo` に `dueDate?: string` 引数を追加
- [x] `services/api.ts`: `updateTodo` の patch 型に `dueDate?: string` / `resetDueDate?: boolean` を追加

### 3. コンポーネントの修正

- [x] `components/molecules/TodoInput.ts`: `<input type="date" id="todo-deadline-input">` を追加
- [x] `components/organisms/TaskListView.ts`: `todo.deadline` → `todo.dueDate` に修正
- [x] `components/organisms/TaskListView.ts`: 締め切りセルに `data-due-display-id` / `data-due-edit-id` を用いたインライン編集 UI を追加

### 4. 状態管理・イベントの修正

- [x] `app.ts`: `addTodo` に `dueDate` 引数を追加し、`createTodo` に渡す
- [x] `app.ts`: `updateDueDate` 関数を新規追加
- [x] `app.ts`: `setupEventListeners` に期限日インライン編集のイベントハンドラーを追加
- [x] `app.ts`: 追加ボタン・Enter キーのハンドラーで日付入力値を読み取り、追加後にリセット

### 5. テストの修正・追加

- [x] `test/services/api.test.ts`: `createTodo` / `updateTodo` のテストを修正・追加
- [x] `test/components/molecules/TodoInput.test.ts`: 日付入力欄のテストを追加
- [x] `test/components/organisms/TaskListView.test.ts`: `dueDate` 表示・インライン編集のテストを追加
- [x] `test/app.test.ts`: `addTodo` / `updateDueDate` のテストを追加

### 6. 動作確認

- [x] `npm run build` でビルドエラーなし
- [x] `npm run test` で全テストパス（176件）

---

## 完了条件

`requirements.md` の受け入れ条件がすべてチェックされていること。
