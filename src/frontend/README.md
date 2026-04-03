# Frontend

## 概要

TypeScript + Vite + Tailwind CSS v4 で構築した Todo アプリのフロントエンドです。
データは `services/api.ts` 経由でバックエンド REST API（ASP.NET Core）に送受信し、PostgreSQL に永続化します。

---

## 技術スタック

| レイヤー        | 技術          | バージョン |
| ------------- | ------------ | -------- |
| 言語           | TypeScript   | ~5.9.3   |
| ビルドツール    | Vite         | ^8.0.1   |
| スタイリング    | Tailwind CSS | v4.2.2   |
| テスト         | Vitest       | ^4.1.0   |
| DOM（テスト用） | happy-dom    | ^20.8.4  |
| リント          | ESLint       | ^10.1.0  |
| フォーマッター   | Prettier     | ^3.8.1   |

---

## ディレクトリ構成

```
src/
├── main.ts              # エントリーポイント
├── app.ts               # ルートコンポーネント（状態管理）
├── types/
│   └── todo.ts          # Todo 型定義
├── components/
│   ├── TodoInput.ts     # タスク入力フォーム
│   ├── TodoList.ts      # タスク一覧
│   ├── TodoItem.ts      # 個別タスク
│   ├── FilterBar.ts     # フィルタータブ
│   └── Footer.ts        # タスク数・一括削除
├── services/
│   └── api.ts           # データアクセス層（REST API クライアント）
└── styles/
    └── main.css         # Tailwind CSS エントリー
```

---

## 前提条件

バックエンド（ASP.NET Core + PostgreSQL）が起動していること。
バックエンドのセットアップは [`src/backend/README.md`](../backend/README.md) を参照。

---

## 開発サーバー起動

### Docker（推奨）

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up frontend
```

アクセス: http://localhost:5173

### ローカル（Node.js 20+）

```bash
npm install
npm run dev
```

---

## 環境変数

| 変数名                | 説明                    | デフォルト値              |
| ------------------- | ---------------------- | ------------------------ |
| `VITE_API_BASE_URL` | バックエンド API の URL  | `http://localhost:8080`  |

開発時は `.env.development` に定義済み。

---

## 主要コマンド

| コマンド               | 内容                    |
| -------------------- | ---------------------- |
| `npm run dev`        | 開発サーバー起動          |
| `npm run build`      | 本番ビルド               |
| `npm run test`       | 単体テスト（1 回実行）    |
| `npm run test:watch` | テスト（ウォッチ）        |
| `npm run lint`       | ESLint チェック          |
| `npm run type-check` | TypeScript 型チェック    |
| `npm run format`     | Prettier フォーマット    |

---

## アーキテクチャ概要

- **状態管理**: `App` コンポーネントが `todos[]` と `filter` をメモリ上で管理
- **データアクセス**: `services/api.ts` が Fetch API でバックエンドと通信（GET / POST / PUT / DELETE）
- **型安全**: strict モード + `any` 禁止
- **コードスタイル**: セミコロンなし・シングルクォート・インデント 2 スペース

### コンポーネント階層

```
App
├── TodoInput
├── FilterBar
├── TodoList
│   └── TodoItem
└── Footer
```

### API エンドポイント（バックエンド）

| メソッド | パス                     | 用途             |
| ------ | ----------------------- | --------------- |
| GET    | `/api/todos`            | 全タスク取得      |
| POST   | `/api/todos`            | タスク作成        |
| PUT    | `/api/todos/{id}`       | タスク更新        |
| DELETE | `/api/todos/{id}`       | タスク削除        |
| DELETE | `/api/todos/completed`  | 完了タスク一括削除 |

---

## 関連ドキュメント

| ドキュメント | 内容 |
| --------- | --- |
| [機能設計書](../../docs/02-basic-design/functional-design.md) | データモデル・コンポーネント設計・画面遷移 |
| [技術仕様書](../../docs/02-basic-design/architecture.md) | 技術スタック・Docker 構成・CI/CD |
| [リポジトリ構造（フロントエンド）](../../docs/03-detailed-design/repository-structure-frontend.md) | ファイル配置ルール・命名規則 |
| [開発ガイドライン](../../docs/03-detailed-design/development-guidelines.md) | Git フロー・コーディング規約 |
| [CLAUDE.md](./CLAUDE.md) | AI 開発者向けガイドライン |
