import { describe, it, expect } from 'vitest'
import { createFooter } from '../../components/Footer'
import type { Todo } from '../../types/todo'

const makeTodo = (id: string, completed: boolean): Todo => ({
  id,
  text: `タスク${id}`,
  completed,
  createdAt: '2026-03-27T09:00:00.000Z',
})

describe('createFooter', () => {
  describe('未完了件数の表示', () => {
    it('未完了が0件のとき「0件残っています」が表示される', () => {
      const footer = createFooter([makeTodo('1', true)], false)
      expect(footer.textContent).toContain('0件残っています')
    })

    it('未完了が1件のとき「1件残っています」が表示される', () => {
      const footer = createFooter([makeTodo('1', false)], false)
      expect(footer.textContent).toContain('1件残っています')
    })

    it('未完了が複数件のとき正しい件数が表示される', () => {
      const todos = [makeTodo('1', false), makeTodo('2', false), makeTodo('3', true)]
      const footer = createFooter(todos, false)
      expect(footer.textContent).toContain('2件残っています')
    })
  })

  describe('「完了済みを削除」ボタン', () => {
    it('完了済みタスクがないときボタンが表示されない', () => {
      const footer = createFooter([makeTodo('1', false)], false)
      const button = footer.querySelector('#clear-completed-button')
      expect(button).toBeNull()
    })

    it('完了済みタスクがあるときボタンが表示される', () => {
      const footer = createFooter([makeTodo('1', true)], false)
      const button = footer.querySelector('#clear-completed-button')
      expect(button).not.toBeNull()
    })

    it('全タスクが完了済みのときボタンが表示される', () => {
      const todos = [makeTodo('1', true), makeTodo('2', true)]
      const footer = createFooter(todos, false)
      const button = footer.querySelector('#clear-completed-button')
      expect(button).not.toBeNull()
    })

    it('isLoading=falseのとき、ボタンがdisabledでない', () => {
      const footer = createFooter([makeTodo('1', true)], false)
      const button = footer.querySelector<HTMLButtonElement>('#clear-completed-button')
      expect(button?.disabled).toBe(false)
    })

    it('isLoading=trueのとき、ボタンがdisabledになる', () => {
      const footer = createFooter([makeTodo('1', true)], true)
      const button = footer.querySelector<HTMLButtonElement>('#clear-completed-button')
      expect(button?.disabled).toBe(true)
    })
  })
})
