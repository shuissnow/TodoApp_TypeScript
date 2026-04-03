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
}

/**
 * タスク一覧のフィルター種別
 * - `all`: すべて表示
 * - `active`: 未完了のみ
 * - `completed`: 完了済みのみ
 */
export type FilterType = 'all' | 'active' | 'completed'
