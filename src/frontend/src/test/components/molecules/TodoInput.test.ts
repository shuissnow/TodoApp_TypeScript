import { describe, it, expect } from 'vitest'
import { createTodoInput } from '../../../components/molecules/TodoInput'

describe('createTodoInput', () => {
  describe('入力フィールド', () => {
    it('id="todo-text-input"のinput要素が存在する', () => {
      const container = createTodoInput(false)
      const input = container.querySelector('#todo-text-input')
      expect(input).not.toBeNull()
    })

    it('input要素のtypeがtextである', () => {
      const container = createTodoInput(false)
      const input = container.querySelector<HTMLInputElement>('#todo-text-input')
      expect(input?.type).toBe('text')
    })

    it('maxLengthが200に設定されている', () => {
      const container = createTodoInput(false)
      const input = container.querySelector<HTMLInputElement>('#todo-text-input')
      expect(input?.maxLength).toBe(200)
    })

    it('isLoading=falseのとき、inputがdisabledでない', () => {
      const container = createTodoInput(false)
      const input = container.querySelector<HTMLInputElement>('#todo-text-input')
      expect(input?.disabled).toBe(false)
    })

    it('isLoading=trueのとき、inputがdisabledになる', () => {
      const container = createTodoInput(true)
      const input = container.querySelector<HTMLInputElement>('#todo-text-input')
      expect(input?.disabled).toBe(true)
    })
  })

  describe('期限日入力フィールド', () => {
    it('id="todo-deadline-input"のinput要素が存在する', () => {
      const container = createTodoInput(false)
      const input = container.querySelector('#todo-deadline-input')
      expect(input).not.toBeNull()
    })

    it('input要素のtypeがdateである', () => {
      const container = createTodoInput(false)
      const input = container.querySelector<HTMLInputElement>('#todo-deadline-input')
      expect(input?.type).toBe('date')
    })

    it('isLoading=falseのとき、inputがdisabledでない', () => {
      const container = createTodoInput(false)
      const input = container.querySelector<HTMLInputElement>('#todo-deadline-input')
      expect(input?.disabled).toBe(false)
    })

    it('isLoading=trueのとき、inputがdisabledになる', () => {
      const container = createTodoInput(true)
      const input = container.querySelector<HTMLInputElement>('#todo-deadline-input')
      expect(input?.disabled).toBe(true)
    })
  })

  describe('追加ボタン', () => {
    it('id="todo-add-button"のbutton要素が存在する', () => {
      const container = createTodoInput(false)
      const button = container.querySelector('#todo-add-button')
      expect(button).not.toBeNull()
    })

    it('ボタンのtypeがbuttonである', () => {
      const container = createTodoInput(false)
      const button = container.querySelector<HTMLButtonElement>('#todo-add-button')
      expect(button?.type).toBe('button')
    })

    it('isLoading=falseのとき、ボタンテキストが「追加」である', () => {
      const container = createTodoInput(false)
      const button = container.querySelector<HTMLButtonElement>('#todo-add-button')
      expect(button?.textContent).toBe('追加')
    })

    it('isLoading=trueのとき、ボタンテキストが「追加中...」になる', () => {
      const container = createTodoInput(true)
      const button = container.querySelector<HTMLButtonElement>('#todo-add-button')
      expect(button?.textContent).toBe('追加中...')
    })

    it('isLoading=falseのとき、ボタンがdisabledでない', () => {
      const container = createTodoInput(false)
      const button = container.querySelector<HTMLButtonElement>('#todo-add-button')
      expect(button?.disabled).toBe(false)
    })

    it('isLoading=trueのとき、ボタンがdisabledになる', () => {
      const container = createTodoInput(true)
      const button = container.querySelector<HTMLButtonElement>('#todo-add-button')
      expect(button?.disabled).toBe(true)
    })
  })
})
