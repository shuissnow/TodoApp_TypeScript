# フロントエンド リポジトリ構造定義書

**バージョン:** 1.1
**作成日:** 2026-03-22
**ステータス:** ドラフト

---

## 1. フロントエンド構成（`frontend/`）

```
frontend/
├── src/                                # ソースコード
├── public/                             # 静的ファイル
├── index.html                          # HTMLエントリーポイント
├── vite.config.ts                      # Vite 設定
├── eslint.config.ts                    # ESLint 設定
├── tsconfig.json                       # TypeScript 設定
├── package.json                        # 依存パッケージ定義
├── package-lock.json                   # 依存パッケージロックファイル
├── .prettierrc                         # Prettier 設定
├── CLAUDE.md                           # フロントエンド固有の開発メモ
├── Dockerfile                          # フロントエンド用 Dockerfile
└── nginx.conf                          # 本番用 nginx 設定
```

---

## 2. ファイル配置ルール

### 命名規則

| 対象 | 規則 | 例 |
|------|------|----|
| TypeScript ファイル（コンポーネント以外） | キャメルケース | `storage.ts`, `app.ts` |
| コンポーネントファイル | パスカルケース | `TodoItem.ts`, `FilterBar.ts` |
| テストファイル | 対象ファイル名 + `.test.ts` | `TodoItem.test.ts` |
| CSS ファイル | ケバブケース | `main.css` |

### ファイル配置の原則
- コンポーネントは `src/components/` に配置
- 型定義は `src/types/` に配置
- 外部リソースへのアクセスは `src/services/` に集約（UIから分離）
- テストコードは `src/test/` に配置（`src/` と同じディレクトリ構成）
- 設定ファイル（`vite.config.ts` 等）は `frontend/` ルートに配置

### コードスタイル（`.prettierrc`）

| 設定項目 | 値 |
|----------|----|
| セミコロン | なし |
| クォート | シングルクォート |
| インデント幅 | 2 |
| 末尾カンマ | あり（all） |
| 最大行幅 | 100 |

---

## 3. 環境変数

### フロントエンド（`.env`）

現時点では環境変数は未使用。将来のバックエンド連携時に追加予定。

| 変数名 | 説明 | v1.0 |
|--------|------|------|
| `VITE_API_BASE_URL` | バックエンドAPIのURL | 未使用（将来使用） |
