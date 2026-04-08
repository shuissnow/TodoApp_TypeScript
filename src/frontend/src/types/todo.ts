/**
 * Todoアイテムの型定義
 */
export interface Todo {
  /** ユニークID（タイムスタンプ + ランダム文字列） */
  id: string
  /** タスクのテキスト内容 */
  text: string
  /** 完了フラグ */
  completed: boolean
  /** 作成日時（ISO 8601形式） */
  createdAt: string
  /** 優先度（オプション） */
  priority?: Priority
  /** 締め切り日（ISO 8601形式、オプション） */
  deadline?: string
}

/**
 * タスク優先度
 * - `high`: 高
 * - `mid`: 中
 * - `low`: 低
 */
export type Priority = 'high' | 'mid' | 'low'

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
