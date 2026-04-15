# design.md

## 実装アプローチ

案A（ドメイン別分割）＋ 案C（ストア分離）の組み合わせ。

- **store.ts** に状態変数を集約し、各モジュールがここを読み書きする
- **actions/** に Todo / 優先度マスタの操作を分離し、循環依存を排除する
- **TodoTop.ts** を新設し、Todo 一覧画面のコンテンツと内部イベントを1つの organism にまとめる
- **app.ts** はハッシュルーティングと初期化のみに絞る

---

## ファイル構成（変更後）

```
src/frontend/src/
├── store.ts                          ← 新規：状態変数を集約
├── actions/
│   ├── todoActions.ts                ← 新規：Todo CRUD
│   └── priorityActions.ts            ← 新規：優先度マスタ操作
├── components/organisms/
│   ├── TodoTop.ts                    ← 新規：Todo 一覧画面コンテンツ
│   ├── MasterTop.ts                  ← 変更なし
│   └── MasterPriority.ts             ← 変更なし
└── app.ts                            ← 変更：ルーティング + initApp のみ
```

---

## 各ファイルの責務と設計

### store.ts

状態変数をミュータブルオブジェクトとしてエクスポートする。

```ts
export const store = {
  todos: [] as Todo[],
  priorities: [] as Priority[],
  filter: 'all' as FilterType,
  viewType: 'list' as ViewType,
  isLoading: false,
}

export type AppStore = typeof store
```

---

### actions/todoActions.ts

各アクションは `onRender: () => void` を最後の引数に受け取り、ローディング開始・完了のタイミングで呼び出す。  
`store` を直接読み書きする。`app.ts` へは依存しない。

```ts
export const addTodo = async (
  text: string,
  dueDate: string | undefined,
  priorityId: string | undefined,
  onRender: () => void,
): Promise<void> => {
  store.isLoading = true
  onRender()
  try { ... } finally {
    store.isLoading = false
    onRender()
  }
}
```

エクスポートする関数: `addTodo` / `toggleTodo` / `deleteTodo` / `updateDueDate` / `updatePriority` / `clearCompleted`

---

### actions/priorityActions.ts

同じパターンで優先度マスタ操作を実装する。

エクスポートする関数: `updatePriorityName` / `updatePriorityForeground` / `updatePriorityBackground` / `togglePriorityStatus`

---

### components/organisms/TodoTop.ts

`MasterPriority.ts` と同様に、状態とコールバックを引数で受け取る。  
DOM 生成後、内部でイベントリスナーを登録する（`setupEventListeners` 相当の処理を内包）。  
これにより `app.ts` 側での後付けイベント登録が不要になる。

```ts
export const createTodoTop = (
  store: AppStore,
  onAddTodo: (text: string, dueDate?: string, priorityId?: string) => void,
  onToggleTodo: (id: number) => void,
  onDeleteTodo: (id: number) => void,
  onUpdateDueDate: (id: number, value: string) => void,
  onUpdatePriority: (id: number, priorityId: string) => void,
  onToggleViewType: () => void,
): HTMLElement
```

内部で組み立てる子コンポーネント（既存・変更なし）:
- `createTodoInput` / `createViewToggle` / `createTaskListView` / `createTaskBoardView`

---

### app.ts（変更後）

ハッシュに応じてコンテンツを切り替えるだけ。イベント登録は各 organism に委譲する。

```ts
export const render = (): void => {
  const hash = window.location.hash
  let contentChildren: HTMLElement[]

  if (hash === '#/master') {
    contentChildren = [createMasterTop()]
  } else if (hash === '#/master/priority') {
    contentChildren = [createMasterPriority(store.priorities, ...handlers)]
  } else {
    contentChildren = [createTodoTop(store, ...handlers)]
  }

  app.replaceChildren(createAppLayout({ header, contentChildren, footer }))
}
```

---

## 依存関係（循環なし）

```
app.ts
  ├── store.ts
  ├── actions/todoActions.ts → store.ts
  ├── actions/priorityActions.ts → store.ts
  └── components/organisms/TodoTop.ts
        ├── store.ts（型のみ）
        └── components/molecules/* / components/organisms/*（変更なし）
```

---

## 影響範囲の分析

| ファイル | 変更種別 | 内容 |
|----------|----------|------|
| `app.ts` | 変更 | ルーティング + initApp のみに削減 |
| `store.ts` | 新規 | 状態変数の集約 |
| `actions/todoActions.ts` | 新規 | Todo 操作を移植 |
| `actions/priorityActions.ts` | 新規 | 優先度マスタ操作を移植 |
| `components/organisms/TodoTop.ts` | 新規 | Todo 一覧画面コンテンツ |
| その他の既存コンポーネント | 変更なし | — |
| 既存テスト | 要確認 | `app.ts` の import パスが変わるため更新が必要な場合あり |
