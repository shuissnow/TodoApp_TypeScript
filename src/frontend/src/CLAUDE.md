# frontend/src/ — Claude 向けガイド

## 概要

TypeScript + Vite + Tailwind CSS v4 で構築した Todo アプリのフロントエンドです。
バックエンド REST API（ASP.NET Core）と通信し、PostgreSQL にデータを永続化します。
データアクセスは `services/api.ts` に集約しており、UI コンポーネントはデータ層の実装に依存しません。

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

### ルール

| フォルダ / ファイル | 役割 |
| ----------------- | --- |
| `main.ts` | エントリーポイント。アプリの起動処理のみ記述する |
| `app.ts` | ルートコンポーネント。状態管理とコンポーネントの組み立てを担う |
| `assets/` | 画像・アイコンなどの静的ファイル |
| `components/` | UI コンポーネント（ファイル名はパスカルケース）。ロジックは持たない |
| `services/` | データアクセス・ビジネスロジック。コンポーネントから切り離して集約する |
| `styles/` | グローバル CSS（Tailwind のエントリーファイルなど） |
| `test/` | 単体テスト。`src/` と同じフォルダ構成で配置する |
| `types/` | 型定義。アプリ全体で共有する型はここにまとめる |

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

## 作業の順番

### 1. 計画

- 実装する機能・関数の仕様を確認する。
- 計画を立てたあと、再度自分でみな押すようにする。

### 2. 実装

- 一度に作成するファイルは最大 1 つ
- 一度に作成する関数は最大 1 つ
- 実装後、承認を得てから次のステップに進む

### 3. 品質チェック（この順番で実行）

```bash
npm run type-check    # TypeScript 型チェック
npm run lint          # ESLint
npm run format        # Prettier
```

### 4. 単体テスト

```bash
npm run test
npm run test:watch 
```

---

## コーディング規約

Google TypeScript スタイルガイドに準拠します。以下はプロジェクト固有の補足ルールです。

### 命名規則

| 対象 | 規則 | 例 |
| --- | --- | --- |
| 変数・関数 | キャメルケース | `todoList`, `addTodo()` |
| 型・インターフェース | パスカルケース | `TodoItem`, `FilterType` |
| 定数 | アッパースネークケース | `MAX_TODO_LENGTH` |
| コンポーネントファイル | パスカルケース | `TodoItem.ts` |
| その他ファイル | キャメルケース | `api.ts` |

### 型

- `any` は使用禁止（ESLint で `error` に設定済み）。やむを得ない場合は `unknown` を使用し、コメントで理由を記載する
- `null` より `undefined` を優先する
- 型推論できる場合は明示的な型注釈を省略してよい
- 関数の引数・戻り値には型を明示する

```typescript
// Good
const addTodo = (text: string): Todo => { ... }

// Bad
const addTodo = (text) => { ... }
```

### 変数・関数

- `const` を基本とし、再代入が必要な場合のみ `let` を使用
- `var` は使用禁止
- アロー関数を基本とする
- 関数には JSDoc を記載する

### インポート

- 相対パスを使用する（`./` または `../`）
- 型のみのインポートは `import type` を使用する

```typescript
// Good
import type { Todo } from '../types/todo'
import { fetchTodos } from '../services/api'
```

### セキュリティ

- `innerHTML` の直接使用は禁止。`textContent` または DOM API を使用する（XSS 対策）
- ユーザー入力は必ずバリデーション・エスケープを行う
- シークレット情報はソースコードに書かず、`.env` を使用する

### スタイリング（Tailwind CSS）

- インラインスタイル（`style` 属性）は原則禁止。Tailwind のユーティリティクラスを使用する
- 繰り返し使うクラスの組み合わせは TypeScript 変数にまとめる

```typescript
// Good
const buttonClass = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'

// Bad
element.style.padding = '8px 16px'
```

- レスポンシブは Tailwind のブレークポイントプレフィックスを使用する（`sm:` `md:` `lg:`）
- カラー・スペーシングは Tailwind のデザイントークンを使用し、任意の値（`w-[123px]` 等）は最小限にする

---

## 単体テストの方針

### テストの種類

- **ブラックボックステスト**: 入力と出力のみを検証する（内部実装に依存しない）
- **ホワイトボックステスト**: 内部の分岐・境界値を意識して網羅的にテストする
- 正常系だけでなく、**境界値・異常系・エラーケース**も必ずテストする

### テストファイルの配置

`src/frontend/test/` 配下に、`src/` と同じフォルダ構成で作成する。

```
test/
├── components/
│   └── TodoItem.test.ts   # src/components/TodoItem.ts に対応
└── services/
    └── api.test.ts        # src/services/api.ts に対応
```

### モック方針

- モックは必要最小限にとどめ、実際の動作に近い形でテストする
- `expect(true).toBe(true)` のような意味のないアサーションは書かない

### テスト実行コマンド

```bash
npm run test          # 単発実行
npm run test:watch    # ウォッチモード
```
