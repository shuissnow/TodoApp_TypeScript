# src/ フォルダ — Claude 向けガイド

## 作業対象の判断

| 作業内容 | 対象フォルダ |
|---------|-------------|
| UI・画面・TypeScript コード | `src/frontend/` |
| API・DB・C# コード | `src/backend/` |

各フォルダの詳細なルール（コーディング規約・作業単位・テスト方針）は、それぞれの `CLAUDE.md` を参照すること。

- フロントエンド: [`frontend/CLAUDE.md`](frontend/CLAUDE.md)
- バックエンド: [`backend/CLAUDE.md`](backend/CLAUDE.md)

---

## 共通ルール

- フロントエンドとバックエンドの変更を1つの作業で同時に行わない
- API 仕様の変更はバックエンドを先に実装し、フロントエンドを後から合わせる
