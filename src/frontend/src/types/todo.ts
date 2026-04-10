/**
 * Todoアイテムの型定義
 */
export interface Todo {
  /** ユニークID（バックエンドが採番する整数） */
  id: number
  /** タスクのテキスト内容 */
  text: string
  /** 完了フラグ */
  completed: boolean
  /** 作成日時（ISO 8601形式） */
  createdAt: string
  /** 優先度（オプション） */
  priority?: Priority
  /** 締め切り日（YYYY-MM-DD形式、オプション） */
  dueDate?: string
}

/**
 * タスク優先度（バックエンドの priorities テーブルに対応）
 */
export interface Priority {
  /** 優先度ID（"001" / "002" / "003"） */
  id: string
  /** 優先度名（"高" / "中" / "低"） */
  name: string
  /** 文字色（例: "#EF4444"） */
  foregroundColor: string
  /** 背景色（例: "#FEE2E2"） */
  backgroundColor: string
}

/**
 * カテゴリ
 */
export interface Category {
  /** ユニークID */
  id: string
  /** カテゴリ名 */
  name: string
}

/**
 * 表示ビュー種別
 * - `list`: テーブルリスト表示
 * - `board`: カンバンボード表示
 */
export type ViewType = 'list' | 'board'

/**
 * タスク一覧のフィルター種別
 * - `all`: すべて表示
 * - `active`: 未完了のみ
 * - `completed`: 完了済みのみ
 */
export type FilterType = 'all' | 'active' | 'completed'
