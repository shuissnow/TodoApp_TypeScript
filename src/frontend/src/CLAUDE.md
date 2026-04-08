# frontend/src/ — Claude 向けガイド

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| 言語・ビルド | TypeScript / Vite |
| スタイリング | Tailwind CSS v4 |
| テスト | Vitest / happy-dom |

---

## プロジェクト構造

```
src/
├── main.ts
├── app.ts
├── assets/
├── components/
├── services/
├── styles/
├── test/
└── types/
```

| フォルダ / ファイル | 役割 |
| ----------------- | --- |
| `main.ts` | エントリーポイント。アプリの起動処理のみ記述する |
| `app.ts` | ルートコンポーネント。状態管理とコンポーネントの組み立てを担う |
| `assets/` | 画像・アイコンなどの静的ファイル |
| `components/` | UI コンポーネント（ファイル名はパスカルケース）。ロジックは持たない |
| `services/` | データアクセス・ビジネスロジック。`api.ts` に集約する |
| `styles/` | グローバル CSS（Tailwind のエントリーファイルなど） |
| `test/` | 単体テスト。`src/` と同じフォルダ構成で配置する |
| `types/` | 型定義。アプリ全体で共有する型はここにまとめる |

---

## 作業ルール

各作業の詳細手順は以下のスキルに従う。

| 作業内容 | スキル |
|---------|--------|
| コード実装 | `implement-code-typescript` |
| 単体テスト | `implement-unittest-typescript` |
| リファクタリング | `refactor-code-typescript` |
| コード解説 | `explain-code-typescript` |
