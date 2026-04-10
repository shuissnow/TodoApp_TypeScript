# design.md — 優先度機能追加（フロントエンド）

## 実装アプローチ

既存の Atomic Design 構成（atoms → molecules → organisms → app.ts）に沿って実装する。
型定義の変更を起点に、API サービス・ユーティリティ・コンポーネントの順で変更を波及させる。

## 変更するコンポーネント

### 新規作成

| ファイル | 内容 |
|---------|------|
| `components/atoms/PrioritySelect.ts` | 優先度選択 `<select>` atom |
| `test/components/atoms/PrioritySelect.test.ts` | PrioritySelect の単体テスト |

### 修正

| ファイル | 変更内容 |
|---------|---------|
| `types/todo.ts` | `Priority` を string union から interface に変更 |
| `services/api.ts` | `fetchPriorities` 追加、`createTodo`/`updateTodo` に `priorityId` 追加 |
| `utils/uiHelpers.ts` | `createPriorityBadge` を Priority オブジェクト対応に変更 |
| `utils/domIds.ts` | `TODO_PRIORITY_SELECT` 追加 |
| `components/molecules/TodoInput.ts` | `PrioritySelect` を追加、`priorities` 引数追加 |
| `components/organisms/TaskListView.ts` | 優先度列のインライン編集追加、`priorities` 引数追加 |
| `components/organisms/TaskBoardView.ts` | 型変更への追従（呼び出し変更なし） |
| `app.ts` | `priorities` 状態追加、`updatePriority` 追加、各コンポーネントへ `priorities` 渡す |

## データ構造の変更

### `types/todo.ts`

```typescript
// 変更前
export type Priority = 'high' | 'mid' | 'low'

// 変更後（バックエンドのレスポンス形式に合わせる）
export interface Priority {
  id: string             // "001" / "002" / "003"
  name: string           // "高" / "中" / "低"
  foregroundColor: string  // "#EF4444"
  backgroundColor: string  // "#FEE2E2"
}
```

`Todo.priority?: Priority` は型参照が変わるだけで宣言は変更なし。

## コンポーネント設計

### `PrioritySelect` atom

```typescript
export interface PrioritySelectProps {
  id: string
  disabled?: boolean
  priorities: Priority[]
  value?: string   // 選択中の priorityId。'' = なし
}
export const createPrioritySelect = (props: PrioritySelectProps): HTMLSelectElement
```

- 先頭に「なし」オプション（value=`''`）
- 選択中 Priority の `foregroundColor` / `backgroundColor` を inline style で反映
- `change` イベントで自身の色を即時更新
- 緑ベーススタイル: `border-green-300`, `focus:ring-green-400`

### `createPriorityBadge` (uiHelpers.ts)

```typescript
// 変更後
export const createPriorityBadge = (priority: Priority | null | undefined): HTMLElement
```

- priority オブジェクトあり → `name` / `foregroundColor` / `backgroundColor` を inline style で適用
- null / undefined → 「低」として表示（fallback: color `#3B82F6`, bg `#DBEAFE`）
- Tailwind の色クラスは削除し、inline style に統一

### `TodoInput` molecule

```typescript
export const createTodoInput = (isLoading: boolean, priorities: Priority[]): HTMLElement
```

レイアウト: `TextInput | DateInput | PrioritySelect | Button`

### `TaskListView` organism

```typescript
export const createTaskListView = (todos: Todo[], isLoading: boolean, priorities: Priority[]): HTMLElement
```

優先度セル（インライン編集）:
- span: `data-priority-display-id="{id}"` でバッジを表示
- select: `data-priority-edit-id="{id}"` で `hidden`、クリックで表示切り替え
- `change` → `updatePriority(id, value)` 呼び出し
- `blur` で値変更なし時は span に戻す（dueDate と同パターン）

### `app.ts`

```typescript
let priorities: Priority[] = []

// initApp: fetchTodos と fetchPriorities を並列実行
const [fetchedTodos, fetchedPriorities] = await Promise.all([fetchTodos(), fetchPriorities()])

// 新規関数
export const updatePriority = async (id: number, priorityId: string): Promise<void>
  // priorityId が '' のとき priorityId: null を送信

// addTodo に priorityId 引数追加
export const addTodo = async (text: string, dueDate?: string, priorityId?: string): Promise<void>
```

## 影響範囲の分析

| 対象 | 影響 | 対応 |
|------|------|------|
| `uiHelpers.test.ts` | `Priority` 型が変わりテスト全滅 | Priority オブジェクトを使ったテストに書き換え |
| `api.test.ts` | `fetchPriorities` / `priorityId` のテストが未実装 | テストケース追加 |
| `TaskBoardView.ts` | `createPriorityBadge` の型変更の影響なし | TypeScript 型チェックのみ確認 |
| 既存 `TodoInput.test.ts` | `createTodoInput` の引数が増える | `priorities` を渡すよう更新 |
| 既存 `TaskListView.test.ts` | `createTaskListView` の引数が増える、インライン編集が増える | 引数追加・インライン編集テスト追加 |
