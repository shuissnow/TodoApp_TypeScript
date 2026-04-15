/**
 * タスク優先度（バックエンドの priorities テーブルに対応）
 */
export interface Priority {
  // 優先度ID
  id: string
  // 優先度名
  name: string
  // 文字色
  foregroundColor: string
  // 背景色
  backgroundColor: string
  // 表示順
  displayOrder: number
  // 削除済みフラグ
  isDeleted: boolean
}
