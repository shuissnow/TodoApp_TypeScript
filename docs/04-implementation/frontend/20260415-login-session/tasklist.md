# tasklist.md — ログイン機能追加（フロントエンド）

## タスク一覧

### 1. 型定義・サービス・アクション

- [ ] `src/types/auth.ts` 新規作成（`User` インターフェース）
- [ ] `src/services/authApi.ts` 新規作成（`login` / `logout` / `fetchMe`）
- [ ] `src/actions/authActions.ts` 新規作成（`loginAction` / `logoutAction`）

### 2. 既存サービスの修正

- [ ] `src/services/todoApi.ts` の全 `fetch` に `credentials: 'include'` を追加
- [ ] `src/services/priorityApi.ts` の全 `fetch` に `credentials: 'include'` を追加

### 3. ストア

- [ ] `src/stores/store.ts` に `currentUser: User | null`（初期値 `null`）を追加

### 4. コンポーネント

- [ ] `src/components/organisms/LoginPage.ts` 新規作成
- [ ] `src/components/organisms/Header.ts` にユーザー名表示・ログアウトボタンを追加（シグネチャ変更）

### 5. app.ts の修正

- [ ] `initApp()` の冒頭に `fetchMe()` によるセッション確認を追加
- [ ] `render()` に認証ガードを追加（`currentUser === null` なら `LoginPage` を描画してリターン）
- [ ] `createHeader()` の呼び出しに `store.currentUser` と `logoutAction` を渡すよう修正
- [ ] ログイン後のデータ取得処理を認証済み状態のみで実行するよう修正

### 6. テスト

- [ ] 既存テスト（app.test.ts）に `fetchMe` のモックを追加して修正

### 7. 動作確認

- [ ] フロントエンド起動（`npm run dev`）
- [ ] 未認証状態でアクセス → ログイン画面が表示されることを確認
- [ ] 誤ったパスワードでログイン → エラーメッセージが表示されることを確認
- [ ] 正しい認証情報でログイン → Todo 画面に遷移することを確認
- [ ] ヘッダーにユーザー名（またはアバター）が表示されることを確認
- [ ] ログアウトボタン押下 → ログイン画面に戻ることを確認
- [ ] ブラウザリロード後も Cookie が有効であればログイン状態が維持されることを確認

## 完了条件

- 全タスクが完了していること
- `npm run test` がエラーなしでパスすること
