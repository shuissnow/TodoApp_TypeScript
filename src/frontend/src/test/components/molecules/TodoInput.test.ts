import { describe, it, expect } from 'vitest'
import { createTodoInput } from '../../../components/molecules/TodoInput'
import type { Priority } from '../../../types/todo'

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

describe('createTodoInput', () => {
  describe('入力フィールド', () => {
    it('id="todo-text-input"のinput要素が存在する', () => {
      const container = createTodoInput(false, PRIORITIES)
      const input = container.querySelector('#todo-text-input')
      expect(input).not.toBeNull()
    })

    it('input要素のtypeがtextである', () => {
      const container = createTodoInput(false, PRIORITIES)
      const input = container.querySelector<HTMLInputElement>('#todo-text-input')
      expect(input?.type).toBe('text')
    })

    it('maxLengthが200に設定されている', () => {
      const container = createTodoInput(false, PRIORITIES)
      const input = container.querySelector<HTMLInputElement>('#todo-text-input')
      expect(input?.maxLength).toBe(200)
    })

    it('isLoading=falseのとき、inputがdisabledでない', () => {
      const container = createTodoInput(false, PRIORITIES)
      const input = container.querySelector<HTMLInputElement>('#todo-text-input')
      expect(input?.disabled).toBe(false)
    })

    it('isLoading=trueのとき、inputがdisabledになる', () => {
      const container = createTodoInput(true, PRIORITIES)
      const input = container.querySelector<HTMLInputElement>('#todo-text-input')
      expect(input?.disabled).toBe(true)
    })
  })

  describe('期限日入力フィールド', () => {
    it('id="todo-deadline-input"のinput要素が存在する', () => {
      const container = createTodoInput(false, PRIORITIES)
      const input = container.querySelector('#todo-deadline-input')
      expect(input).not.toBeNull()
    })

    it('input要素のtypeがdateである', () => {
      const container = createTodoInput(false, PRIORITIES)
      const input = container.querySelector<HTMLInputElement>('#todo-deadline-input')
      expect(input?.type).toBe('date')
    })

    it('isLoading=falseのとき、inputがdisabledでない', () => {
      const container = createTodoInput(false, PRIORITIES)
      const input = container.querySelector<HTMLInputElement>('#todo-deadline-input')
      expect(input?.disabled).toBe(false)
    })

    it('isLoading=trueのとき、inputがdisabledになる', () => {
      const container = createTodoInput(true, PRIORITIES)
      const input = container.querySelector<HTMLInputElement>('#todo-deadline-input')
      expect(input?.disabled).toBe(true)
    })
  })

  describe('優先度セレクト', () => {
    it('id="todo-priority-select"のselect要素が存在する', () => {
      const container = createTodoInput(false, PRIORITIES)
      const select = container.querySelector('#todo-priority-select')
      expect(select).not.toBeNull()
    })

    it('select要素のtagNameがSELECTである', () => {
      const container = createTodoInput(false, PRIORITIES)
      const select = container.querySelector('#todo-priority-select')
      expect(select?.tagName).toBe('SELECT')
    })

    it('isLoading=falseのとき、selectがdisabledでない', () => {
      const container = createTodoInput(false, PRIORITIES)
      const select = container.querySelector<HTMLSelectElement>('#todo-priority-select')
      expect(select?.disabled).toBe(false)
    })

    it('isLoading=trueのとき、selectがdisabledになる', () => {
      const container = createTodoInput(true, PRIORITIES)
      const select = container.querySelector<HTMLSelectElement>('#todo-priority-select')
      expect(select?.disabled).toBe(true)
    })

    it('優先度リストのオプションが含まれる', () => {
      const container = createTodoInput(false, PRIORITIES)
      const select = container.querySelector<HTMLSelectElement>('#todo-priority-select')
      // なし + 高 + 中 + 低 = 4件
      expect(select?.options.length).toBe(4)
    })
  })

  describe('追加ボタン', () => {
    it('id="todo-add-button"のbutton要素が存在する', () => {
      const container = createTodoInput(false, PRIORITIES)
      const button = container.querySelector('#todo-add-button')
      expect(button).not.toBeNull()
    })

    it('ボタンのtypeがbuttonである', () => {
      const container = createTodoInput(false, PRIORITIES)
      const button = container.querySelector<HTMLButtonElement>('#todo-add-button')
      expect(button?.type).toBe('button')
    })

    it('isLoading=falseのとき、ボタンテキストが「追加」である', () => {
      const container = createTodoInput(false, PRIORITIES)
      const button = container.querySelector<HTMLButtonElement>('#todo-add-button')
      expect(button?.textContent).toBe('追加')
    })

    it('isLoading=trueのとき、ボタンテキストが「追加中...」になる', () => {
      const container = createTodoInput(true, PRIORITIES)
      const button = container.querySelector<HTMLButtonElement>('#todo-add-button')
      expect(button?.textContent).toBe('追加中...')
    })

    it('isLoading=falseのとき、ボタンがdisabledでない', () => {
      const container = createTodoInput(false, PRIORITIES)
      const button = container.querySelector<HTMLButtonElement>('#todo-add-button')
      expect(button?.disabled).toBe(false)
    })

    it('isLoading=trueのとき、ボタンがdisabledになる', () => {
      const container = createTodoInput(true, PRIORITIES)
      const button = container.querySelector<HTMLButtonElement>('#todo-add-button')
      expect(button?.disabled).toBe(true)
    })
  })
})
