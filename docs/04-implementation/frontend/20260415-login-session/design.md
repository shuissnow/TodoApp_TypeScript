# design.md — ログイン機能追加（フロントエンド）

## 実装アプローチ

既存のアーキテクチャ（services / actions / store / components の分離）に沿って実装する。
Cookie 認証のため、全 `fetch` リクエストに `credentials: 'include'` を追加する。
ルーティングは既存のハッシュベース方式を維持したまま、`render()` 内に認証ガードを追加する。

## 変更するコンポーネント

### 新規作成

| ファイル | 内容 |
|----------|------|
| `src/types/auth.ts` | `User` 型定義 |
| `src/services/authApi.ts` | login / logout / fetchMe API 呼び出し |
| `src/actions/authActions.ts` | login / logout アクション（store 更新 + API 呼び出し） |
| `src/components/organisms/LoginPage.ts` | ログイン画面 DOM 生成コンポーネント |

### 修正

| ファイル | 変更内容 |
|----------|----------|
| `src/stores/store.ts` | `currentUser: User \| null` フィールドを追加 |
| `src/services/todoApi.ts` | 全 `fetch` に `credentials: 'include'` を追加 |
| `src/services/priorityApi.ts` | 全 `fetch` に `credentials: 'include'` を追加 |
| `src/app.ts` | 認証チェック処理・ログイン画面へのルーティングガードを追加 |
| `src/components/organisms/Header.ts` | ユーザー名表示・ログアウトボタンを追加 |

## 型定義

### `src/types/auth.ts`

```typescript
export interface User {
  id: number
  username: string
}
```

## API サービス設計

### `src/services/authApi.ts`

```typescript
export const login = async (username: string, password: string): Promise<User> => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) throw new Error('Login failed')
  return response.json() as Promise<User>
}

export const logout = async (): Promise<void> => {
  await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}

export const fetchMe = async (): Promise<User | null> => {
  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    credentials: 'include',
  })
  if (!response.ok) return null
  return response.json() as Promise<User>
}
```

## アクション設計

### `src/actions/authActions.ts`

```typescript
export const loginAction = async (username: string, password: string): Promise<User> => {
  const user = await login(username, password)
  store.currentUser = user
  return user
}

export const logoutAction = async (): Promise<void> => {
  await logout()
  store.currentUser = null
  store.todos = []
  store.priorities = []
}
```

## ストア変更

### `src/stores/store.ts`（追加フィールド）

```typescript
import type { User } from '../types/auth'

export const store = {
  todos: [] as Todo[],
  priorities: [] as Priority[],
  filter: 'all' as FilterType,
  viewType: 'list' as ViewType,
  isLoading: false,
  currentUser: null as User | null,  // 追加
}
```

## app.ts の変更

### 認証チェックフロー

```
initApp()
  ↓
fetchMe() → 成功: store.currentUser = user
           失敗: store.currentUser = null
  ↓
render()
  ↓
currentUser === null → LoginPage を描画（ここで処理終了）
currentUser !== null → 既存の hash ルーティング処理
                       + データ取得（todos / priorities）
```

### render() への認証ガード追加

```typescript
export const render = (): void => {
  const app = document.querySelector<HTMLDivElement>(DOM_IDS.APP)
  if (!app) return

  // 未認証ならログイン画面のみ表示
  if (!store.currentUser) {
    app.replaceChildren(createLoginPage())
    return
  }

  // 既存のハッシュルーティング処理...
}
```

### initApp() の変更

```typescript
export const initApp = async (): Promise<void> => {
  window.addEventListener('hashchange', () => { render() })

  // セッション確認（認証状態を把握してから初回描画）
  store.currentUser = await fetchMe()
  render()

  // 認証済みの場合のみデータ取得
  if (store.currentUser) {
    store.isLoading = true
    render()
    try {
      const [fetchedTodos, fetchedPriorities] = await Promise.all([
        fetchTodos(),
        fetchAllPriorities(),
      ])
      store.todos = fetchedTodos
      store.priorities = fetchedPriorities
    } catch (err) {
      console.error('initApp error:', err)
    } finally {
      store.isLoading = false
      render()
    }
  }
}
```

## LoginPage コンポーネント設計

### `src/components/organisms/LoginPage.ts`

```
LoginPage（organism）
  <div> 画面中央寄せ（flex + min-h-screen）
    <div> カード（shadow / rounded / padding）
      <h1> "TodoApp" ロゴ
      <form>
        <label> ユーザー名
        TextInput (atom) [type="text"]
        <label> パスワード
        TextInput (atom) [type="password"]
        <p> エラーメッセージ（認証失敗時のみ表示）
        Button (atom) "ログイン"
```

- シグネチャ: `createLoginPage(): HTMLElement`
- submit ハンドラ:
  1. `event.preventDefault()`
  2. `loginAction(username, password)` を呼び出し
  3. 成功 → `render()` を呼び出して TodoTop へ遷移（データ取得も実行）
  4. 失敗 → エラーメッセージ要素のテキストを更新（再描画なし）

## Header コンポーネントの変更

```typescript
// 変更前
export const createHeader = (): HTMLElement

// 変更後
export const createHeader = (
  currentUser: User | null,
  onLogout: () => void
): HTMLElement
```

追加要素:
- ユーザー名の頭文字をアバター（円形バッジ）として表示
- 「ログアウト」ボタンを右端に追加

## 影響範囲の分析

| 対象 | 影響 | 対応 |
|------|------|------|
| 既存の `fetch` 呼び出し（todoApi / priorityApi） | Cookie が送られず 401 になる | `credentials: 'include'` を全箇所に追加 |
| `createHeader()` の呼び出し箇所（app.ts） | シグネチャ変更による引数不一致 | `store.currentUser` と `logoutAction` を渡すよう修正 |
| 既存テスト（app.test.ts） | `initApp` / `render` の挙動変化 | 認証モックを追加 |
