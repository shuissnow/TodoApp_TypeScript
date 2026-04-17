# タスクリスト — E2E テスト（Playwright）

**作成日:** 2026-04-16

---

## タスク一覧

### セットアップ

- [ ] `@playwright/test` を frontend プロジェクトに追加する（`npm install -D @playwright/test`）
- [ ] `src/frontend/playwright.config.ts` を作成する
- [ ] `src/frontend/package.json` に `"e2e": "playwright test"` スクリプトを追加する

### テストコード実装

- [ ] `src/frontend/e2e/helpers/auth.ts` を作成する（ログインヘルパー）
- [ ] `src/frontend/e2e/auth.spec.ts` を作成する（認証フロー）
  - [ ] ログイン成功のテスト
  - [ ] ログイン失敗（誤パスワード）のテスト
  - [ ] 未認証リダイレクトのテスト
- [ ] `src/frontend/e2e/todo.spec.ts` を作成する（Todo 操作フロー）
  - [ ] タスク作成のテスト
  - [ ] タスク完了のテスト
  - [ ] タスク削除のテスト
  - [ ] フィルター（未完了）のテスト
  - [ ] フィルター（完了）のテスト

### CI 統合

- [ ] `.github/workflows/e2e.yml` を作成する

### 動作確認

- [ ] ローカルで `npm run e2e` を実行してテストが全て通ることを確認する
- [ ] PR を作成して GitHub Actions の E2E ジョブが起動することを確認する
- [ ] テスト失敗時にスクリーンショットがアーティファクトに保存されることを確認する
