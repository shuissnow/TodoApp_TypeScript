import { login, logout } from '../services/authApi'
import type { User } from '../types/auth'
import { store } from '../stores/store'

/**
 * ログインしてストアのユーザー情報を更新する
 *
 * @param username - ユーザー名
 * @param password - パスワード
 * @returns ログインしたユーザー情報
 */
export const loginAction = async (username: string, password: string): Promise<User> => {
  const user = await login(username, password)
  store.currentUser = user
  return user
}

/**
 * ログアウトしてストアのユーザー情報・データをリセットする
 *
 * ログアウト後に別ユーザーのデータが残らないよう todos / priorities もクリアする。
 */
export const logoutAction = async (): Promise<void> => {
  await logout()
  store.currentUser = null
  store.todos = []
  store.priorities = []
}
