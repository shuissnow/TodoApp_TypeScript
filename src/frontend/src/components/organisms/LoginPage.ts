import { createTextInput } from '../atoms/TextInput'
import { createButton } from '../atoms/Button'
import { loginAction } from '../../actions/authActions'

const INPUT_CLASS: string =
  'w-full h-[38px] border border-green-400 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600'

/**
 * ラベルと入力フィールドのグループを生成する
 *
 * @param id - input 要素の ID
 * @param labelText - ラベルのテキスト
 * @param placeholder - プレースホルダー
 * @param type - input の type 属性（デフォルト: 'text'）
 * @returns フィールドのラッパー要素と input 要素
 */
const createInputField = (
  id: string,
  labelText: string,
  placeholder: string,
  type: string = 'text',
): { field: HTMLDivElement; input: HTMLInputElement } => {
  const label = document.createElement('label')
  label.textContent = labelText
  label.className = 'text-sm font-medium text-green-900'
  label.htmlFor = id

  const input = createTextInput({ id, placeholder })
  if (type !== 'text') input.type = type
  input.className = INPUT_CLASS

  const field = document.createElement('div')
  field.className = 'flex flex-col gap-1'
  field.appendChild(label)
  field.appendChild(input)

  return { field, input }
}

/**
 * フォームの submit イベントを登録する
 *
 * ログイン処理中はボタンを無効化し、失敗時はエラーメッセージを表示する。
 *
 * @param form - イベントを登録する form 要素
 * @param usernameInput - ユーザー名の input 要素
 * @param passwordInput - パスワードの input 要素
 * @param loginButton - ログインボタン要素
 * @param errorMsg - エラーメッセージの p 要素
 * @param onLogin - ログイン成功後に呼び出すコールバック
 */
const setupSubmitHandler = (
  form: HTMLFormElement,
  usernameInput: HTMLInputElement,
  passwordInput: HTMLInputElement,
  loginButton: HTMLButtonElement,
  errorMsg: HTMLParagraphElement,
  onLogin: () => void,
): void => {
  form.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault()
    const username: string = usernameInput.value.trim()
    const password: string = passwordInput.value

    loginButton.disabled = true
    errorMsg.classList.add('hidden')

    void loginAction(username, password)
      .then(() => {
        onLogin()
      })
      .catch(() => {
        errorMsg.textContent = 'ユーザー名またはパスワードが正しくありません'
        errorMsg.classList.remove('hidden')
        loginButton.disabled = false
      })
  })
}

/**
 * ログイン画面のDOM要素を生成する
 *
 * ユーザー名・パスワードの入力フォームを表示し、
 * ログイン成功時に onLogin コールバックを呼び出す。
 * ログイン失敗時はフォーム下部にエラーメッセージを表示する（再描画なし）。
 *
 * @param onLogin - ログイン成功後に呼び出すコールバック（通常は render()）
 * @returns ログイン画面のルート要素
 */
export const createLoginPage = (onLogin: () => void): HTMLElement => {
  const { field: usernameField, input: usernameInput } = createInputField(
    'login-username',
    'ユーザー名',
    'ユーザー名を入力',
  )
  const { field: passwordField, input: passwordInput } = createInputField(
    'login-password',
    'パスワード',
    'パスワードを入力',
    'password',
  )

  const errorMsg = document.createElement('p')
  errorMsg.className = 'text-sm text-red-600 hidden'
  errorMsg.setAttribute('role', 'alert')

  const loginButton = createButton({ id: 'login-button', text: 'ログイン' })
  loginButton.type = 'submit'
  loginButton.className =
    'w-full h-[38px] bg-green-800 text-green-50 text-sm font-medium rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const form = document.createElement('form')
  form.className = 'flex flex-col gap-5'
  form.appendChild(usernameField)
  form.appendChild(passwordField)
  form.appendChild(errorMsg)
  form.appendChild(loginButton)

  setupSubmitHandler(form, usernameInput, passwordInput, loginButton, errorMsg, onLogin)

  const title = document.createElement('h1')
  title.textContent = 'TodoApp'
  title.className = 'text-2xl font-bold text-green-800 text-center mb-8'

  const card = document.createElement('div')
  card.className = 'w-full max-w-sm bg-white rounded-2xl shadow-md px-8 py-10'
  card.appendChild(title)
  card.appendChild(form)

  const wrapper = document.createElement('div')
  wrapper.className = 'flex items-center justify-center min-h-screen bg-green-50'
  wrapper.appendChild(card)

  return wrapper
}
