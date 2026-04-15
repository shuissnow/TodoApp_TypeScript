import type { Priority } from './priority'
export type { Priority } from './priority'

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
