# design.md — 期限日入力・編集・表示の追加（フロントエンド）

**作成日:** 2026-04-09

---

## 1. 実装アプローチ

既存のアーキテクチャ（状態管理 `app.ts` → API `services/api.ts` → コンポーネント）に沿って変更を加える。

インライン編集は「クリックで span を input に差し替え → 確定/キャンセルで元に戻す」という DOM 直接操作で実装する。確定後は API 呼び出し → `render()` でスナップショット更新する。

---

## 2. 変更するコンポーネント

| ファイル | 変更内容 |
|---------|---------|
| `types/todo.ts` | `deadline` → `dueDate` にリネーム（バックエンド JSON と統一） |
| `services/api.ts` | `createTodo` に `dueDate?: string`、`updateTodo` の patch 型に `dueDate?: string` / `resetDueDate?: boolean` を追加 |
| `utils/domIds.ts` | `TODO_DEADLINE_INPUT` セレクターを追加 |
| `components/molecules/TodoInput.ts` | テキスト入力の右隣に `<input type="date">` を追加 |
| `components/organisms/TaskListView.ts` | `todo.deadline` → `todo.dueDate` に修正。締め切りセルにインライン編集 UI を追加（`data-due-display-id` / `data-due-edit-id`） |
| `app.ts` | `addTodo` に `dueDate` 引数を追加。`updateDueDate` 関数を新規追加。`setupEventListeners` に追加/編集/キャンセルのイベントハンドラーを追加 |

---

## 3. データ構造の変更

### 3.1 `types/todo.ts`

```typescript
// 変更前
deadline?: string

// 変更後
dueDate?: string
```

### 3.2 `services/api.ts`

```typescript
// createTodo
export const createTodo = async (text: string, dueDate?: string): Promise<Todo>
// リクエストボディ: { text, dueDate }（dueDate が undefined の場合はキーを含めない）

// updateTodo
export const updateTodo = async (
  id: string,
  patch: { text?: string; completed?: boolean; dueDate?: string; resetDueDate?: boolean },
): Promise<Todo>
```

---

## 4. インライン編集の実装詳細

### 4.1 DOM 構造

締め切りセルに `data-due-display-id` 付きの `<span>` を配置する。

```html
<!-- 通常表示 -->
<span data-due-display-id="123">2026-04-30</span>

<!-- クリック後（span を input に差し替え） -->
<input type="date" data-due-edit-id="123" value="2026-04-30" />
```

### 4.2 イベントフロー

| イベント | 操作 | 処理 |
|---------|------|------|
| `click` on `[data-due-display-id]` | セルをクリック | span を非表示にして input を表示 |
| `change` on `[data-due-edit-id]` | 日付を選択 | `updateDueDate(id, value)` を呼び出す |
| `blur` on `[data-due-edit-id]` | フォーカスを外す | 値が変わっていれば `updateDueDate` を呼び出す（change で処理済みの場合は重複しない） |
| `keydown Escape` on `[data-due-edit-id]` | Escape を押す | 変更を破棄して span を再表示 |

### 4.3 `updateDueDate` の実装

```typescript
export const updateDueDate = async (id: string, value: string): Promise<void> => {
  const patch = value ? { dueDate: value } : { resetDueDate: true }
  // updateTodo を呼び出して状態を更新し、render() する
}
```

---

## 5. 影響範囲の分析

| 項目 | 影響 |
|------|------|
| `todo.deadline` 参照箇所 | `TaskListView.ts` → `todo.dueDate` に修正が必要 |
| `createTodo` の呼び出し元 | `app.ts` の `addTodo` のみ |
| `updateTodo` の呼び出し元 | `app.ts` の `toggleTodo` のみ（patch 型の拡張のみで既存動作に影響なし） |
| 既存テスト | `api.test.ts`、`app.test.ts`、`TodoInput.test.ts` への追加・修正が必要 |
