# tasklist.md

## 実装タスク

依存関係の順に実施する。各タスク完了後にビルドエラーがないことを確認しながら進める。

---

### タスク一覧

| # | タスク | ステータス |
|---|--------|-----------|
| 1 | `store.ts` を新規作成する | [ ] |
| 2 | `actions/todoActions.ts` を新規作成する | [ ] |
| 3 | `actions/priorityActions.ts` を新規作成する | [ ] |
| 4 | `components/organisms/TodoTop.ts` を新規作成する | [ ] |
| 5 | `app.ts` をルーティング＋初期化のみに変更する | [ ] |
| 6 | `test/app.test.ts` の import パスを更新する | [ ] |
| 7 | ビルド確認（`npm run build`） | [ ] |
| 8 | テスト実行（`npm run test`） | [ ] |

---

## タスク詳細

### タスク1: `store.ts` を新規作成する

**作成先:** `src/frontend/src/store.ts`

- `todos`, `priorities`, `filter`, `viewType`, `isLoading` をミュータブルオブジェクト `store` としてエクスポートする
- `AppStore` 型を `typeof store` としてエクスポートする
- `MAX_TEXT_LENGTH` 定数もここに移動する

---

### タスク2: `actions/todoActions.ts` を新規作成する

**作成先:** `src/frontend/src/actions/todoActions.ts`

- `app.ts` から以下の関数を移植する
  - `addTodo`
  - `toggleTodo`
  - `deleteTodo`
  - `updateDueDate`
  - `updatePriority`
  - `clearCompleted`
- 各関数の最後の引数に `onRender: () => void` を追加し、ローディング切り替えのタイミングで呼び出す
- 状態の読み書きは `store` オブジェクトを通じて行う

---

### タスク3: `actions/priorityActions.ts` を新規作成する

**作成先:** `src/frontend/src/actions/priorityActions.ts`

- `app.ts` から以下の関数を移植する
  - `updatePriorityName`
  - `updatePriorityForeground`
  - `updatePriorityBackground`
  - `togglePriorityStatus`
- タスク2 と同様に `onRender: () => void` を引数に追加する

---

### タスク4: `components/organisms/TodoTop.ts` を新規作成する

**作成先:** `src/frontend/src/components/organisms/TodoTop.ts`

- 以下を引数で受け取る
  - `store: AppStore`（状態）
  - 各操作のコールバック（`onAddTodo`, `onToggleTodo`, `onDeleteTodo`, `onUpdateDueDate`, `onUpdatePriority`, `onToggleViewType`）
- 現在の `render()` のデフォルトルート（Todo 一覧）で組み立てていた以下を内部で生成する
  - セクション見出し（`<h2>`）
  - `createTodoInput`
  - 区切り線
  - `createViewToggle`
  - `createTaskListView` または `createTaskBoardView`（`store.viewType` で切り替え）
- 現在 `setupEventListeners()` で行っていたイベント登録を内部に移す
  - テキスト入力 Enter・追加ボタンクリック → `onAddTodo`
  - ビュー切り替えボタン → `onToggleViewType`
  - Todo チェックボタン → `onToggleTodo`
  - 期限日インライン編集（表示切替・change・blur・Escape）→ `onUpdateDueDate`
  - 優先度インライン編集（表示切替・change・blur）→ `onUpdatePriority`

---

### タスク5: `app.ts` をルーティング＋初期化のみに変更する

- `render()` をハッシュルーティングのみに変更する
  - `#/master` → `createMasterTop()`
  - `#/master/priority` → `createMasterPriority(...)` に `priorityActions` のハンドラを渡す
  - デフォルト → `createTodoTop(store, ...handlers)` に変更する
- `setupEventListeners()` と `setupMasterPriorityEventListeners()` の呼び出しを削除する
- 移植済みの関数・状態変数を `app.ts` から削除する
- `setFilter` と `toggleViewType` は `app.ts` に残す（`store` を更新して `render()` を呼ぶだけのため）

---

### タスク6: `test/app.test.ts` の import パスを更新する

- `addTodo`, `toggleTodo`, `deleteTodo`, `clearCompleted`, `updateDueDate` の import 元を `'../app'` から `'../actions/todoActions'` に変更する
- `render`, `setFilter` は引き続き `'../app'` からインポートする

---

## 完了条件

- `npm run build` がエラーなく通る
- `npm run test` で全テストが通る
- ブラウザで以下の動作が確認できる
  - Todo の作成・完了切り替え・削除
  - 期限日・優先度のインライン編集
  - ビュー切り替え（リスト / ボード）
  - 優先度マスタ画面の操作
