import { describe, it, expect } from 'vitest'
import { createTodoList } from '../../../components/organisms/TodoList'
import type { Todo } from '../../../types/todo'

const makeTodo = (id: number, completed = false): Todo => ({
  id,
  text: `タスク${id}`,
  completed,
  createdAt: '2026-03-27T09:00:00.000Z',
})

describe('createTodoList', () => {
  describe('空配列のとき', () => {
    it('「タスクがありません」が表示される', () => {
      const wrapper = createTodoList([], false)
      expect(wrapper.textContent).toContain('タスクがありません')
    })

    it('リストアイテムが1件のみ（空メッセージ）', () => {
      const wrapper = createTodoList([], false)
      const items = wrapper.querySelectorAll('li')
      expect(items.length).toBe(1)
    })
  })

  describe('todosがあるとき', () => {
    it('todos件数分のli要素が生成される', () => {
      const wrapper = createTodoList([makeTodo(1), makeTodo(2), makeTodo(3)], false)
      const items = wrapper.querySelectorAll('li')
      expect(items.length).toBe(3)
    })

    it('各アイテムにdata-idが設定される', () => {
      const wrapper = createTodoList([makeTodo(1), makeTodo(2)], false)
      const ids = Array.from(wrapper.querySelectorAll<HTMLInputElement>('input[data-id]')).map(
        (el) => el.dataset['id'],
      )
      expect(ids).toEqual(['1', '2'])
    })

    it('「タスクがありません」が表示されない', () => {
      const wrapper = createTodoList([makeTodo(1)], false)
      expect(wrapper.textContent).not.toContain('タスクがありません')
    })
  })

  describe('isLoading', () => {
    it('isLoading=falseのとき、オーバーレイが表示されない', () => {
      const wrapper = createTodoList([makeTodo(1)], false)
      const overlay = wrapper.querySelector('.bg-white\\/70')
      expect(overlay).toBeNull()
    })

    it('isLoading=trueのとき、オーバーレイが表示される', () => {
      const wrapper = createTodoList([makeTodo(1)], true)
      const overlay = wrapper.querySelector('.bg-white\\/70')
      expect(overlay).not.toBeNull()
    })

    it('isLoading=trueのとき、スピナーのSVGが表示される', () => {
      const wrapper = createTodoList([], true)
      const svg = wrapper.querySelector('svg')
      expect(svg).not.toBeNull()
    })

    it('isLoading=falseのとき、スピナーのSVGが表示されない', () => {
      const wrapper = createTodoList([], false)
      const svg = wrapper.querySelector('svg')
      expect(svg).toBeNull()
    })

    it('isLoading=trueのとき、各アイテムのチェックボックスがdisabledになる', () => {
      const wrapper = createTodoList([makeTodo(1), makeTodo(2)], true)
      const checkboxes = wrapper.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
      checkboxes.forEach((cb) => expect(cb.disabled).toBe(true))
    })
  })
})
