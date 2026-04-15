import { describe, it, expect } from 'vitest'
import { createTaskBoardView } from '../../../components/organisms/TaskBoardView'
import type { Priority, Todo } from '../../../types/todo'

const PRIORITIES: Priority[] = [
  {
    id: '001',
    name: '高',
    foregroundColor: '#EF4444',
    backgroundColor: '#FEE2E2',
    displayOrder: 1,
    isDeleted: false,
  },
  {
    id: '002',
    name: '中',
    foregroundColor: '#F97316',
    backgroundColor: '#FFEDD5',
    displayOrder: 2,
    isDeleted: false,
  },
  {
    id: '003',
    name: '低',
    foregroundColor: '#3B82F6',
    backgroundColor: '#DBEAFE',
    displayOrder: 3,
    isDeleted: false,
  },
]

const makeTodo = (id: number, overrides: Partial<Todo> = {}): Todo => ({
  id,
  text: `タスク${id}`,
  completed: false,
  createdAt: '2026-04-08T00:00:00.000Z',
  ...overrides,
})

describe('createTaskBoardView', () => {
  describe('カラム構成', () => {
    it('3つのカラムが表示される', () => {
      const board = createTaskBoardView([])
      // bg-green-50 rounded-xl は各カラムのクラス
      const columns = board.querySelectorAll('.bg-green-50.rounded-xl')
      expect(columns.length).toBe(3)
    })

    it('「未着手」カラムのラベルが存在する', () => {
      const board = createTaskBoardView([])
      expect(board.textContent).toContain('未着手')
    })

    it('「進行中」カラムのラベルが存在する', () => {
      const board = createTaskBoardView([])
      expect(board.textContent).toContain('進行中')
    })

    it('「完了」カラムのラベルが存在する', () => {
      const board = createTaskBoardView([])
      expect(board.textContent).toContain('完了')
    })
  })

  describe('Todoの振り分け', () => {
    it('未完了のtodoのテキストが表示される', () => {
      const board = createTaskBoardView([makeTodo(1, { text: '未完了タスク', completed: false })])
      expect(board.textContent).toContain('未完了タスク')
    })

    it('完了済みのtodoのテキストが表示される', () => {
      const board = createTaskBoardView([makeTodo(1, { text: '完了タスク', completed: true })])
      expect(board.textContent).toContain('完了タスク')
    })

    it('「進行中」カラムは常に空（「タスクなし」が表示される）', () => {
      const board = createTaskBoardView([makeTodo(1)])
      // 「進行中」列のカード数を確認するため、各列を確認
      const columns = board.querySelectorAll('.bg-green-50.rounded-xl')
      const inProgressColumn = columns[1]
      expect(inProgressColumn?.textContent).toContain('タスクなし')
    })
  })

  describe('空配列のとき', () => {
    it('各カラムに「タスクなし」が表示される', () => {
      const board = createTaskBoardView([])
      const emptyMessages = board.querySelectorAll('p')
      const emptyTexts = Array.from(emptyMessages).map((p) => p.textContent)
      const taskNashiCount = emptyTexts.filter((t) => t === 'タスクなし').length
      expect(taskNashiCount).toBe(3)
    })
  })

  describe('deadline表示', () => {
    it('deadline設定時、その値が表示される', () => {
      const board = createTaskBoardView([makeTodo(1, { dueDate: '2026-04-30' })])
      expect(board.textContent).toContain('2026-04-30')
    })

    it('deadline未設定時、日付が表示されない', () => {
      const board = createTaskBoardView([makeTodo(1)])
      // deadline spanはpriority badgeの隣に出るため、日付フォーマットで確認
      const deadlineSpans = Array.from(board.querySelectorAll('span')).filter((s) =>
        /\d{4}-\d{2}-\d{2}/.test(s.textContent ?? ''),
      )
      expect(deadlineSpans.length).toBe(0)
    })
  })

  describe('優先度バッジ', () => {
    it('Priority オブジェクト（高）のとき「高」バッジが表示される', () => {
      const board = createTaskBoardView([makeTodo(1, { priority: PRIORITIES[0] })])
      expect(board.textContent).toContain('高')
    })

    it('Priority オブジェクト（中）のとき「中」バッジが表示される', () => {
      const board = createTaskBoardView([makeTodo(1, { priority: PRIORITIES[1] })])
      expect(board.textContent).toContain('中')
    })

    it('Priority オブジェクト（低）のとき「低」バッジが表示される', () => {
      const board = createTaskBoardView([makeTodo(1, { priority: PRIORITIES[2] })])
      expect(board.textContent).toContain('低')
    })

    it('priority=undefined のとき「低」バッジが表示される（nullフォールバック）', () => {
      const board = createTaskBoardView([makeTodo(1)])
      expect(board.textContent).toContain('低')
    })
  })
})
