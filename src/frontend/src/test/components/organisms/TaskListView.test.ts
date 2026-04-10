import { describe, it, expect } from 'vitest'
import { createTaskListView } from '../../../components/organisms/TaskListView'
import type { Priority, Todo } from '../../../types/todo'

const PRIORITIES: Priority[] = [
  { id: '001', name: '高', foregroundColor: '#EF4444', backgroundColor: '#FEE2E2' },
  { id: '002', name: '中', foregroundColor: '#F97316', backgroundColor: '#FFEDD5' },
  { id: '003', name: '低', foregroundColor: '#3B82F6', backgroundColor: '#DBEAFE' },
]

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
      const wrapper = createTaskListView([], false, PRIORITIES)
      expect(wrapper.textContent).toContain('タスクがありません')
    })

    it('table要素が存在しない', () => {
      const wrapper = createTaskListView([], false, PRIORITIES)
      expect(wrapper.querySelector('table')).toBeNull()
    })
  })

  describe('todosがあるとき', () => {
    it('table要素が表示される', () => {
      const wrapper = createTaskListView([makeTodo(1)], false, PRIORITIES)
      expect(wrapper.querySelector('table')).not.toBeNull()
    })

    it('todos件数分のtr要素がtbodyに生成される', () => {
      const wrapper = createTaskListView([makeTodo(1), makeTodo(2), makeTodo(3)], false, PRIORITIES)
      const rows = wrapper.querySelectorAll('tbody tr')
      expect(rows.length).toBe(3)
    })

    it('「タスクがありません」が表示されない', () => {
      const wrapper = createTaskListView([makeTodo(1)], false, PRIORITIES)
      expect(wrapper.textContent).not.toContain('タスクがありません')
    })

    it('todo.textが表示される', () => {
      const wrapper = createTaskListView([makeTodo(1, { text: '牛乳を買う' })], false, PRIORITIES)
      expect(wrapper.textContent).toContain('牛乳を買う')
    })
  })

  describe('完了状態', () => {
    it('completed=falseのとき打ち消し線クラスが付かない', () => {
      const wrapper = createTaskListView([makeTodo(1, { completed: false })], false, PRIORITIES)
      const span = wrapper.querySelector<HTMLSpanElement>('tbody span')
      expect(span?.className).not.toContain('line-through')
    })

    it('completed=trueのとき打ち消し線クラスが付く', () => {
      const wrapper = createTaskListView([makeTodo(1, { completed: true })], false, PRIORITIES)
      const span = wrapper.querySelector<HTMLSpanElement>('tbody span')
      expect(span?.className).toContain('line-through')
    })

    it('completed=falseのとき「未完了」が表示される', () => {
      const wrapper = createTaskListView([makeTodo(1, { completed: false })], false, PRIORITIES)
      expect(wrapper.textContent).toContain('未完了')
    })

    it('completed=trueのとき「完了」が表示される', () => {
      const wrapper = createTaskListView([makeTodo(1, { completed: true })], false, PRIORITIES)
      expect(wrapper.textContent).toContain('完了')
    })
  })

  describe('締め切り表示', () => {
    it('deadline設定時、その値が表示される', () => {
      const wrapper = createTaskListView([makeTodo(1, { dueDate: '2026-04-30' })], false, PRIORITIES)
      expect(wrapper.textContent).toContain('2026-04-30')
    })

    it('deadline未設定時、「—」が表示される', () => {
      const wrapper = createTaskListView([makeTodo(1)], false, PRIORITIES)
      expect(wrapper.textContent).toContain('—')
    })
  })

  describe('優先度バッジ表示', () => {
    it('priority オブジェクト設定時、その name が表示される', () => {
      const wrapper = createTaskListView(
        [makeTodo(1, { priority: PRIORITIES[0] })],
        false,
        PRIORITIES,
      )
      expect(wrapper.textContent).toContain('高')
    })

    it('priority=undefined のとき「低」バッジが表示される', () => {
      const wrapper = createTaskListView([makeTodo(1)], false, PRIORITIES)
      expect(wrapper.textContent).toContain('低')
    })

    it('優先度バッジの wrap span に data-priority-display-id が設定される', () => {
      const wrapper = createTaskListView([makeTodo(42)], false, PRIORITIES)
      const wrap = wrapper.querySelector('[data-priority-display-id="42"]')
      expect(wrap).not.toBeNull()
    })
  })

  describe('優先度インライン編集', () => {
    it('優先度編集 select に data-priority-edit-id が設定される', () => {
      const wrapper = createTaskListView([makeTodo(42)], false, PRIORITIES)
      const select = wrapper.querySelector('[data-priority-edit-id="42"]')
      expect(select).not.toBeNull()
    })

    it('優先度編集 select は初期状態で hidden クラスが付く', () => {
      const wrapper = createTaskListView([makeTodo(1)], false, PRIORITIES)
      const select = wrapper.querySelector<HTMLSelectElement>('[data-priority-edit-id]')
      expect(select?.classList.contains('hidden')).toBe(true)
    })

    it('todo.priority が設定されているとき編集 select の初期値がその id になる', () => {
      const wrapper = createTaskListView(
        [makeTodo(1, { priority: PRIORITIES[1] })],
        false,
        PRIORITIES,
      )
      const select = wrapper.querySelector<HTMLSelectElement>('[data-priority-edit-id]')
      expect(select?.value).toBe('002')
    })

    it('todo.priority が未設定のとき編集 select の初期値が空文字になる', () => {
      const wrapper = createTaskListView([makeTodo(1)], false, PRIORITIES)
      const select = wrapper.querySelector<HTMLSelectElement>('[data-priority-edit-id]')
      expect(select?.value).toBe('')
    })
  })

  describe('チェックボタン', () => {
    it('チェックボタンにdata-id属性が設定される', () => {
      const wrapper = createTaskListView([makeTodo(123)], false, PRIORITIES)
      const btn = wrapper.querySelector<HTMLButtonElement>('button[data-id]')
      expect(btn?.dataset['id']).toBe('123')
    })

    it('isLoading=trueのとき、チェックボタンがdisabledになる', () => {
      const wrapper = createTaskListView([makeTodo(1)], true, PRIORITIES)
      const btn = wrapper.querySelector<HTMLButtonElement>('button[data-id]')
      expect(btn?.disabled).toBe(true)
    })

    it('isLoading=falseのとき、チェックボタンがdisabledでない', () => {
      const wrapper = createTaskListView([makeTodo(1)], false, PRIORITIES)
      const btn = wrapper.querySelector<HTMLButtonElement>('button[data-id]')
      expect(btn?.disabled).toBe(false)
    })
  })

  describe('isLoading', () => {
    it('isLoading=falseのとき、オーバーレイが表示されない', () => {
      const wrapper = createTaskListView([makeTodo(1)], false, PRIORITIES)
      expect(wrapper.querySelector('.bg-white\\/70')).toBeNull()
    })

    it('isLoading=trueのとき、オーバーレイが表示される', () => {
      const wrapper = createTaskListView([makeTodo(1)], true, PRIORITIES)
      expect(wrapper.querySelector('.bg-white\\/70')).not.toBeNull()
    })
  })
})
