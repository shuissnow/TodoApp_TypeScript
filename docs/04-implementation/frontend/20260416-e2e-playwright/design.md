# 設計書 — E2E テスト（Playwright）

**作成日:** 2026-04-16  
**ステータス:** ドラフト

---

## 1. 全体構成

```
PR 作成 / 更新
    │
    ▼
GitHub Actions (e2e.yml)
    ├─ docker-compose で PostgreSQL を起動
    ├─ dotnet run でバックエンドを起動（:8080）
    ├─ npx vite preview でフロントエンドを起動（:4173）
    │
    ▼
Playwright（Chromium）
    ├─ e2e/auth.spec.ts  — ログインフロー
    └─ e2e/todo.spec.ts  — Todo CRUD フロー
```

---

## 2. 作成・変更ファイル一覧

| ファイル | 種別 | 内容 |
|---------|------|------|
| `src/frontend/playwright.config.ts` | 新規 | Playwright 設定 |
| `src/frontend/e2e/helpers/auth.ts` | 新規 | ログインヘルパー関数 |
| `src/frontend/e2e/auth.spec.ts` | 新規 | 認証フロー E2E テスト |
| `src/frontend/e2e/todo.spec.ts` | 新規 | Todo 操作フロー E2E テスト |
| `.github/workflows/e2e.yml` | 新規 | E2E CI ワークフロー |
| `src/frontend/package.json` | 変更 | `e2e` スクリプトの追加 |

---

## 3. Playwright 設定（`playwright.config.ts`）

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,        // DB 共有のためシリアル実行
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : 'list',
  use: {
    baseURL: 'http://localhost:4173',  // vite preview のデフォルトポート
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

---

## 4. テストヘルパー（`e2e/helpers/auth.ts`）

ログイン操作を共通化し、各テストから再利用する。

```typescript
import { Page } from '@playwright/test';

export async function login(page: Page, username: string, password: string) {
  await page.goto('/');
  await page.getByLabel('ユーザー名').fill(username);
  await page.getByLabel('パスワード').fill(password);
  await page.getByRole('button', { name: 'ログイン' }).click();
  await page.waitForURL('/');  // ログイン後のリダイレクト待機
}
```

---

## 5. テスト設計

### 5-1. `e2e/auth.spec.ts`

| テストケース | 操作 | 期待結果 |
|------------|------|---------|
| ログイン成功 | 正しい認証情報を入力して送信 | Todo 画面が表示される |
| ログイン失敗（誤パスワード） | 誤ったパスワードを入力して送信 | エラーメッセージが表示される |
| 未認証リダイレクト | ログインせずに `/` にアクセス | ログイン画面にリダイレクトされる |

### 5-2. `e2e/todo.spec.ts`

各テストの `beforeEach` でログイン済み状態を作る。

| テストケース | 操作 | 期待結果 |
|------------|------|---------|
| タスク作成 | テキスト入力後 Enter | 入力したタスクが一覧に表示される |
| タスク完了 | チェックボックスをクリック | タスクが完了状態（取り消し線）になる |
| タスク削除 | 削除ボタンをクリック | タスクが一覧から消える |
| フィルター（未完了） | 「未完了」フィルターをクリック | 完了済みタスクが非表示になる |
| フィルター（完了） | 「完了」フィルターをクリック | 未完了タスクが非表示になる |

---

## 6. `e2e.yml` ワークフロー設計

**配置**: `.github/workflows/e2e.yml`

```yaml
name: E2E Tests

on:
  pull_request:
    branches: [main]

concurrency:
  group: e2e-${{ github.ref }}
  cancel-in-progress: true

jobs:
  e2e:
    name: Playwright E2E
    runs-on: ubuntu-latest
    timeout-minutes: 20

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: todoapp_test
          POSTGRES_USER: todoapp
          POSTGRES_PASSWORD: password
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '9.0.x'

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.19.0'
          cache: npm
          cache-dependency-path: src/frontend/package-lock.json

      - name: Restore backend
        working-directory: src/backend
        run: dotnet restore TodoApp.sln

      - name: Build backend
        working-directory: src/backend
        run: dotnet build TodoApp.sln --no-restore --configuration Release --property:OpenApiGenerateDocuments=false

      - name: Start backend
        working-directory: src/backend/src/TodoApp.Api
        env:
          ASPNETCORE_ENVIRONMENT: Development
          ConnectionStrings__DefaultConnection: >-
            Host=localhost;Port=5432;Database=todoapp_test;Username=todoapp;Password=password
        run: dotnet run --no-build --configuration Release &

      - name: Install frontend dependencies
        working-directory: src/frontend
        run: npm ci

      - name: Build frontend
        working-directory: src/frontend
        run: npx vite build

      - name: Install Playwright browsers
        working-directory: src/frontend
        run: npx playwright install chromium --with-deps

      - name: Wait for backend
        run: |
          for i in $(seq 1 30); do
            curl -s http://localhost:8080/health && break
            sleep 2
          done

      - name: Start frontend preview
        working-directory: src/frontend
        run: npx vite preview &

      - name: Run E2E tests
        working-directory: src/frontend
        run: npm run e2e

      - name: Upload test artifacts
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: src/frontend/playwright-report/
```

### 設計上の判断

| 項目 | 判断 | 理由 |
|------|------|------|
| DB 起動方法 | `services:` ブロック | docker-compose より設定が簡潔でポート管理が容易 |
| フロントエンド | `vite preview`（ビルド済み成果物） | dev サーバーより本番に近い状態でテストできる |
| `fullyParallel: false` | シリアル実行 | DB を共有するためテスト間の干渉を防ぐ |
| アーティファクト保存 | `if: failure()` のみ | 成功時のアップロードを省いて高速化 |

---

## 7. `package.json` 変更

`src/frontend/package.json` の `scripts` に追加:

```json
"e2e": "playwright test"
```
