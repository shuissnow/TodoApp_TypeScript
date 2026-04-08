import { describe, it, expect } from 'vitest'
import { createTodoItem } from '../../../components/molecules/TodoItem'
import type { Todo } from '../../../types/todo'

const baseTodo: Todo = {
  id: 'test-id-1',
  text: '牛乳を買う',
  completed: false,
  createdAt: '2026-03-27T09:00:00.000Z',
}

describe('createTodoItem', () => {
  describe('data属性', () => {
    it('チェックボックスにdata-idが設定される', () => {
      const li = createTodoItem(baseTodo, false)
      const checkbox = li.querySelector<HTMLInputElement>('input[type="checkbox"]')
      expect(checkbox?.dataset['id']).toBe('test-id-1')
    })

    it('削除ボタンにdata-delete-idが設定される', () => {
      const li = createTodoItem(baseTodo, false)
      const deleteButton = li.querySelector<HTMLButtonElement>('[data-delete-id]')
      expect(deleteButton?.dataset['deleteId']).toBe('test-id-1')
    })
  })

  describe('完了状態', () => {
    it('completedがfalseのとき打ち消し線クラスが付かない', () => {
      const li = createTodoItem({ ...baseTodo, completed: false }, false)
      const text = li.querySelector('span')
      expect(text?.className).not.toContain('line-through')
    })

    it('completedがtrueのとき打ち消し線クラスが付く', () => {
      const li = createTodoItem({ ...baseTodo, completed: true }, false)
      const text = li.querySelector('span')
      expect(text?.className).toContain('line-through')
    })

    it('completedがtrueのときチェックボックスがcheckedになる', () => {
      const li = createTodoItem({ ...baseTodo, completed: true }, false)
      const checkbox = li.querySelector<HTMLInputElement>('input[type="checkbox"]')
      expect(checkbox?.checked).toBe(true)
    })

    it('completedがfalseのときチェックボックスがuncheckedになる', () => {
      const li = createTodoItem({ ...baseTodo, completed: false }, false)
      const checkbox = li.querySelector<HTMLInputElement>('input[type="checkbox"]')
      expect(checkbox?.checked).toBe(false)
    })
  })

  describe('テキスト表示', () => {
    it('todoのtextがspan要素に表示される', () => {
      const li = createTodoItem(baseTodo, false)
      const text = li.querySelector('span')
      expect(text?.textContent).toBe('牛乳を買う')
    })
  })

  describe('isLoading', () => {
    it('isLoading=falseのとき、チェックボックスがdisabledでない', () => {
      const li = createTodoItem(baseTodo, false)
      const checkbox = li.querySelector<HTMLInputElement>('input[type="checkbox"]')
      expect(checkbox?.disabled).toBe(false)
    })

    it('isLoading=trueのとき、チェックボックスがdisabledになる', () => {
      const li = createTodoItem(baseTodo, true)
      const checkbox = li.querySelector<HTMLInputElement>('input[type="checkbox"]')
      expect(checkbox?.disabled).toBe(true)
    })

    it('isLoading=falseのとき、削除ボタンがdisabledでない', () => {
      const li = createTodoItem(baseTodo, false)
      const deleteButton = li.querySelector<HTMLButtonElement>('[data-delete-id]')
      expect(deleteButton?.disabled).toBe(false)
    })

    it('isLoading=trueのとき、削除ボタンがdisabledになる', () => {
      const li = createTodoItem(baseTodo, true)
      const deleteButton = li.querySelector<HTMLButtonElement>('[data-delete-id]')
      expect(deleteButton?.disabled).toBe(true)
    })
  })
})
