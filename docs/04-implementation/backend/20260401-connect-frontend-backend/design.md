# design.md — フロントエンド・バックエンド連携

**作成日:** 2026-04-01
**対象ステアリング:** `docs/steering/20260401-connect-frontend-backend/`

---

## 実装アプローチ

### 方針

- `services/storage.ts`（LocalStorage）を `services/api.ts`（fetch API）に置き換える
- `app.ts` の状態管理に `isLoading: boolean` を追加し、API呼び出し中の画面制御を行う
- コンポーネント（`TodoInput`, `TodoList`）の関数シグネチャに `isLoading` を追加して disabled 状態を伝達する

---

## 変更するファイル

| ファイル | 変更種別 | 概要 |
|---|---|---|
| `src/services/api.ts` | **新規作成** | Backend API呼び出しクライアント |
| `src/app.ts` | **変更** | 非同期化・isLoading状態追加・API呼び出しに切替 |
| `src/components/TodoInput.ts` | **変更** | `isLoading` 引数追加・disabled制御 |
| `src/components/TodoList.ts` | **変更** | `isLoading` 引数追加・スピナー表示 |
| `src/components/TodoItem.ts` | **変更** | `isLoading` 引数追加・disabled制御 |
| `src/services/storage.ts` | **削除** | LocalStorage層を削除 |
| `.env.development` | **新規作成** | `VITE_API_BASE_URL` 設定 |

---

## 新規作成: `services/api.ts`

Backend APIへの fetch ラッパー。全関数が `async`。

```
BASE_URL = import.meta.env.VITE_API_BASE_URL（デフォルト: http://localhost:8080）

fetchTodos()         GET    /api/todos           → Todo[]
createTodo(text)     POST   /api/todos           → Todo
updateTodo(id,patch) PUT    /api/todos/{id}      → Todo
deleteTodoById(id)   DELETE /api/todos/{id}      → void
deleteCompleted()    DELETE /api/todos/completed → void
```

- レスポンス型は `Todo`（`src/types/todo.ts` の既存型と互換）
- HTTPエラー（4xx/5xx）は `throw new Error(...)` で上位に伝達

---

## 変更: `app.ts` — 状態管理と非同期化

### 状態変数

```
let todos: Todo[]        // 現在のTodo一覧
let filter: FilterType   // フィルター種別
let isLoading: boolean   // API呼び出し中フラグ
```

### 初期化

```
DOMContentLoaded イベントで initApp() を呼び出す

initApp():
  isLoading = true → render()
  todos = await fetchTodos()
  isLoading = false → render()
```

### CRUD操作パターン（全共通）

```
isLoading = true → render()
await api呼び出し
todosを更新（APIレスポンスまたは再取得）
isLoading = false → render()
```

### 削除: `generateId()` / `loadTodos()` / `saveTodos()`

---

## ローディングUI設計

### 基本方針

- API呼び出し中（`isLoading === true`）は操作不能にして、視覚的フィードバックを提供する

### 表示内容

| 要素 | isLoading = false | isLoading = true |
|---|---|---|
| テキスト入力 | 通常 | `disabled` |
| 追加ボタン | 通常 | `disabled` + テキスト「追加」→「追加中...」 |
| チェックボックス | 通常 | `disabled` |
| 削除ボタン | 通常 | `disabled` |
| 完了済みを削除ボタン | 通常 | `disabled` |
| Todoリスト | リスト表示 | スピナーを重ねて半透明オーバーレイ |

### Todoリストのローディングオーバーレイ

```
<div class="relative">
  <!-- Todoリスト（既存） -->
  <ul>...</ul>

  <!-- ローディングオーバーレイ（isLoading時のみ表示） -->
  <div class="absolute inset-0 bg-white/70 flex items-center justify-center">
    <!-- SVGスピナー（Tailwindアニメーション animate-spin） -->
    <svg class="animate-spin h-6 w-6 text-blue-500" .../>
  </div>
</div>
```

---

## 環境変数

### `.env.development`

```
VITE_API_BASE_URL=http://localhost:8080
```

### `api.ts` での参照

```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
```

---

## データ型の互換性

| フィールド | Frontend `Todo` | Backend `Todo` (JSON) | 互換性 |
|---|---|---|---|
| `id` | `string` | `"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"` | ○ (UUID文字列) |
| `text` | `string` | `string` | ○ |
| `completed` | `boolean` | `boolean` | ○ |
| `createdAt` | `string` (ISO 8601) | `string` (ISO 8601) | ○ |

型変換・マッピングは不要。`src/types/todo.ts` の `Todo` 型をそのまま使用する。

---

## 影響範囲の分析

### 影響あり

- `app.ts` — CRUD操作・初期化・レンダリングすべて変更
- `components/TodoInput.ts` — `isLoading` 引数追加
- `components/TodoList.ts` — `isLoading` 引数追加・スピナー追加
- `components/TodoItem.ts` — `isLoading` 引数追加

### 影響なし

- `components/FilterBar.ts` — 変更不要
- `components/Footer.ts` — `isLoading` による disabled 制御は追加
- `types/todo.ts` — 変更不要
- Backend — 変更不要
