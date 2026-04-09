import type { Category } from '../../types/todo'

/** CategoryManager に渡す props */
interface CategoryManagerProps {
  categories: Category[]
  isLoading: boolean
}

/**
 * カテゴリ管理UIのDOM要素を生成する
 *
 * カテゴリの一覧表示・追加・削除ができるシンプルなUIを提供する。
 * 追加は #add-category-button のクリックで、削除は data-category-id 属性を持つボタンで行う。
 *
 * @param props - categories と isLoading
 * @returns カテゴリ管理UIの `<div>` 要素
 */
export const createCategoryManager = (props: CategoryManagerProps): HTMLElement => {
  const { categories, isLoading } = props

  const wrapper = document.createElement('div')
  wrapper.className = 'mb-4 p-3 bg-green-50 rounded-xl'

  // ヘッダー
  const header = document.createElement('p')
  header.textContent = 'カテゴリ管理'
  header.className = 'text-xs font-medium text-green-800 mb-2'
  wrapper.appendChild(header)

  // 入力行
  const inputRow = document.createElement('div')
  inputRow.className = 'flex gap-2 mb-2'

  const nameInput = document.createElement('input')
  nameInput.type = 'text'
  nameInput.id = 'category-name-input'
  nameInput.placeholder = 'カテゴリ名を入力...'
  nameInput.maxLength = 50
  nameInput.disabled = isLoading
  nameInput.className =
    'flex-1 h-[34px] border border-green-400 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 disabled:opacity-50 disabled:cursor-not-allowed'

  const addButton = document.createElement('button')
  addButton.type = 'button'
  addButton.id = 'add-category-button'
  addButton.textContent = '追加'
  addButton.disabled = isLoading
  addButton.className =
    'h-[34px] px-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  inputRow.appendChild(nameInput)
  inputRow.appendChild(addButton)
  wrapper.appendChild(inputRow)

  // カテゴリ一覧
  if (categories.length > 0) {
    const list = document.createElement('div')
    list.className = 'flex flex-wrap gap-1.5'

    categories.forEach((cat) => {
      const tag = document.createElement('span')
      tag.className =
        'inline-flex items-center gap-1 bg-white border border-green-300 text-green-800 text-xs rounded-full px-2.5 py-1'

      const nameSpan = document.createElement('span')
      nameSpan.textContent = cat.name
      tag.appendChild(nameSpan)

      const deleteBtn = document.createElement('button')
      deleteBtn.type = 'button'
      deleteBtn.dataset['categoryId'] = cat.id
      deleteBtn.disabled = isLoading
      deleteBtn.setAttribute('aria-label', `「${cat.name}」を削除`)
      deleteBtn.className =
        'text-green-500 hover:text-red-500 transition-colors disabled:cursor-not-allowed'
      deleteBtn.textContent = '×'
      tag.appendChild(deleteBtn)

      list.appendChild(tag)
    })

    wrapper.appendChild(list)
  }

  return wrapper
}
