# tasklist.md — フロントエンド・バックエンド連携

**作成日:** 2026-04-01
**対象ステアリング:** `docs/steering/20260401-connect-frontend-backend/`

---

## タスク一覧

### Phase 1: 環境変数

- [x] **T-01** `.env.development` を作成し `VITE_API_BASE_URL=http://localhost:8080` を設定する

### Phase 2: APIクライアント

- [x] **T-02** `src/frontend/src/services/api.ts` を新規作成する
  - `fetchTodos()` → `GET /api/todos`
  - `createTodo(text)` → `POST /api/todos`
  - `updateTodo(id, patch)` → `PUT /api/todos/{id}`
  - `deleteTodoById(id)` → `DELETE /api/todos/{id}`
  - `deleteCompleted()` → `DELETE /api/todos/completed`
  - HTTPエラー（4xx/5xx）は `throw new Error(...)` で伝達

### Phase 3: コンポーネント更新

- [x] **T-03** `src/frontend/src/components/TodoInput.ts` を更新する
  - 引数に `isLoading: boolean` を追加
  - `isLoading` が `true` のとき入力フィールドと追加ボタンを `disabled` にする
  - 追加ボタンのテキストを `isLoading` に応じて「追加」／「追加中...」に切り替える

- [x] **T-04** `src/frontend/src/components/TodoItem.ts` を更新する
  - 引数に `isLoading: boolean` を追加
  - `isLoading` が `true` のときチェックボックスと削除ボタンを `disabled` にする

- [x] **T-05** `src/frontend/src/components/TodoList.ts` を更新する
  - 引数に `isLoading: boolean` を追加
  - `isLoading` が `true` のとき `<ul>` の上に半透明オーバーレイ＋SVGスピナーを表示する
  - `createTodoItem` 呼び出しに `isLoading` を渡す

- [x] **T-06** `src/frontend/src/components/Footer.ts` を更新する
  - 引数に `isLoading: boolean` を追加
  - `isLoading` が `true` のとき「完了済みを削除」ボタンを `disabled` にする

### Phase 4: `app.ts` 非同期化

- [x] **T-07** `app.ts` の状態変数・初期化を更新する
  - `isLoading: boolean` 状態変数を追加
  - `loadTodos()` の同期呼び出しを削除
  - `DOMContentLoaded` で `initApp()` を呼び出す
  - `initApp()`: `isLoading = true` → `render()` → `await fetchTodos()` → `isLoading = false` → `render()`

- [x] **T-08** `app.ts` の `addTodo` を非同期化する
  - `async` 化し `await createTodo(text)` を呼ぶ
  - APIレスポンスで `todos` を更新（再取得ではなくレスポンス値を末尾追加）
  - `isLoading` フラグで `render()` を囲む

- [x] **T-09** `app.ts` の `toggleTodo` を非同期化する
  - `async` 化し `await updateTodo(id, { completed: !current.completed })` を呼ぶ
  - APIレスポンスで該当Todoを差し替え
  - `isLoading` フラグで `render()` を囲む

- [x] **T-10** `app.ts` の `deleteTodo` を非同期化する
  - `async` 化し `await deleteTodoById(id)` を呼ぶ
  - 成功後 `todos` から該当IDを除外
  - `isLoading` フラグで `render()` を囲む

- [x] **T-11** `app.ts` の `clearCompleted` を非同期化する
  - `async` 化し `await deleteCompleted()` を呼ぶ
  - 成功後 `todos` から完了済みを除外
  - `isLoading` フラグで `render()` を囲む

- [x] **T-12** `app.ts` の `render()` を更新する
  - 各コンポーネントへの `isLoading` 渡し漏れがないよう修正
  - `generateId()` 関数を削除
  - `saveTodos()` 呼び出しをすべて削除

### Phase 5: クリーンアップ

- [x] **T-13** `src/frontend/src/services/storage.ts` を削除する

### Phase 6: 品質チェック・動作確認

- [x] **T-14** `tsc --noEmit` で型エラーがないことを確認する
- [x] **T-15** `eslint src` でLintエラーがないことを確認する
- [x] **T-16** `docker compose -f docker-compose.yml -f docker-compose.dev.yml up` で全サービス起動を確認する
- [x] **T-17** ブラウザでCRUD操作を行い、DBに正しく反映されることを確認する
- [x] **T-18** ページリロード後にタスク一覧がAPIから復元されることを確認する
- [x] **T-19** API呼び出し中にローディングUIが表示されることを確認する

---

## 完了条件

- `tsc --noEmit` / `eslint src` がエラーなし
- `storage.ts` が削除されており、LocalStorageへの依存がコード上に残っていない
- 全CRUD操作がDBに反映される
- ページリロード後もタスク一覧が復元される
- API呼び出し中にスピナーが表示され、操作ボタンが無効化される
