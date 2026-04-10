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
 * タスク優先度
 * - `high`: 高
 * - `mid`: 中
 * - `low`: 低
 */
export type Priority = 'high' | 'mid' | 'low'

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
