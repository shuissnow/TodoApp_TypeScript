import { describe, it, expect } from 'vitest'
import { createTaskListView } from '../../../components/organisms/TaskListView'
import type { Todo } from '../../../types/todo'

const makeTodo = (id: number, overrides: Partial<Todo> = {}): Todo => ({
  id,
  text: `タスク${id}`,
  completed: false,
  createdAt: '2026-04-08T00:00:00.000Z',
  ...overrides,
})

describe('createTaskListView', () => {
  describe('空配列のとき', () => {
    it('「タスクがありません」が表示される', () => {
      const wrapper = createTaskListView([], false)
      expect(wrapper.textContent).toContain('タスクがありません')
    })

    it('table要素が存在しない', () => {
      const wrapper = createTaskListView([], false)
      expect(wrapper.querySelector('table')).toBeNull()
    })
  })

  describe('todosがあるとき', () => {
    it('table要素が表示される', () => {
      const wrapper = createTaskListView([makeTodo(1)], false)
      expect(wrapper.querySelector('table')).not.toBeNull()
    })

    it('todos件数分のtr要素がtbodyに生成される', () => {
      const wrapper = createTaskListView([makeTodo(1), makeTodo(2), makeTodo(3)], false)
      const rows = wrapper.querySelectorAll('tbody tr')
      expect(rows.length).toBe(3)
    })

    it('「タスクがありません」が表示されない', () => {
      const wrapper = createTaskListView([makeTodo(1)], false)
      expect(wrapper.textContent).not.toContain('タスクがありません')
    })

    it('todo.textが表示される', () => {
      const wrapper = createTaskListView([makeTodo(1, { text: '牛乳を買う' })], false)
      expect(wrapper.textContent).toContain('牛乳を買う')
    })
  })

  describe('完了状態', () => {
    it('completed=falseのとき打ち消し線クラスが付かない', () => {
      const wrapper = createTaskListView([makeTodo(1, { completed: false })], false)
      const span = wrapper.querySelector<HTMLSpanElement>('tbody span')
      expect(span?.className).not.toContain('line-through')
    })

    it('completed=trueのとき打ち消し線クラスが付く', () => {
      const wrapper = createTaskListView([makeTodo(1, { completed: true })], false)
      const span = wrapper.querySelector<HTMLSpanElement>('tbody span')
      expect(span?.className).toContain('line-through')
    })

    it('completed=falseのとき「未完了」が表示される', () => {
      const wrapper = createTaskListView([makeTodo(1, { completed: false })], false)
      expect(wrapper.textContent).toContain('未完了')
    })

    it('completed=trueのとき「完了」が表示される', () => {
      const wrapper = createTaskListView([makeTodo(1, { completed: true })], false)
      expect(wrapper.textContent).toContain('完了')
    })
  })

  describe('締め切り表示', () => {
    it('deadline設定時、その値が表示される', () => {
      const wrapper = createTaskListView([makeTodo(1, { dueDate: '2026-04-30' })], false)
      expect(wrapper.textContent).toContain('2026-04-30')
    })

    it('deadline未設定時、「—」が表示される', () => {
      const wrapper = createTaskListView([makeTodo(1)], false)
      expect(wrapper.textContent).toContain('—')
    })
  })

  describe('チェックボタン', () => {
    it('チェックボタンにdata-id属性が設定される', () => {
      const wrapper = createTaskListView([makeTodo(123)], false)
      const btn = wrapper.querySelector<HTMLButtonElement>('button[data-id]')
      expect(btn?.dataset['id']).toBe('123')
    })

    it('isLoading=trueのとき、チェックボタンがdisabledになる', () => {
      const wrapper = createTaskListView([makeTodo(1)], true)
      const btn = wrapper.querySelector<HTMLButtonElement>('button[data-id]')
      expect(btn?.disabled).toBe(true)
    })

    it('isLoading=falseのとき、チェックボタンがdisabledでない', () => {
      const wrapper = createTaskListView([makeTodo(1)], false)
      const btn = wrapper.querySelector<HTMLButtonElement>('button[data-id]')
      expect(btn?.disabled).toBe(false)
    })
  })

  describe('isLoading', () => {
    it('isLoading=falseのとき、オーバーレイが表示されない', () => {
      const wrapper = createTaskListView([makeTodo(1)], false)
      expect(wrapper.querySelector('.bg-white\\/70')).toBeNull()
    })

    it('isLoading=trueのとき、オーバーレイが表示される', () => {
      const wrapper = createTaskListView([makeTodo(1)], true)
      expect(wrapper.querySelector('.bg-white\\/70')).not.toBeNull()
    })
  })
})
