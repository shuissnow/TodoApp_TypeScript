# src/

TodoApp のソースコードを管理するフォルダです。
フロントエンドとバックエンドをそれぞれ独立したサブフォルダで管理しています。

---

## フォルダ構成

```
src/
├── frontend/   # TypeScript (Vanilla) + Vite + Tailwind CSS
└── backend/    # ASP.NET Core Web API (.NET 9) + EF Core + PostgreSQL
```

---

## 各フォルダの概要

### `frontend/`

TypeScript（バニラ）+ Vite + Tailwind CSS で構築したフロントエンドです。
フレームワークを使わず、DOM操作を直接 TypeScript で記述しています。

詳細は [`frontend/README.md`](frontend/README.md) を参照してください。

### `backend/`

ASP.NET Core Web API (.NET 9) + Entity Framework Core + PostgreSQL で構築したバックエンドです。
Controller / Service / Repository の3層構造で実装しています。

詳細は [`backend/README.md`](backend/README.md) を参照してください。

---

## 通信仕様

フロントエンドはバックエンドの REST API を経由してデータを取得・更新します。

| 項目 | 値 |
|------|-----|
| API ベース URL | `http://localhost:8080/api` |
| データ形式 | JSON |
| CORS | `http://localhost:5173` を許可済み |
