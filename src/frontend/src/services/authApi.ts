import { BASE_URL } from './config'
import type { User } from '../types/auth'

/**
 * ユーザー名とパスワードでログインする
 *
 * ログイン成功時はサーバーが Cookie をセットする。
 * 失敗時（401 など）は Error をスローする。
 *
 * @param username - ユーザー名
 * @param password - パスワード
 * @returns ログインしたユーザー情報
 */
export const login = async (username: string, password: string): Promise<User> => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) throw new Error('Login failed')
  return response.json() as Promise<User>
}

/**
 * ログアウトする
 *
 * サーバー側でセッション Cookie を無効化する。
 */
export const logout = async (): Promise<void> => {
  await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}

/**
 * 現在のセッションからログイン中のユーザー情報を取得する
 *
 * 未認証（401）またはエラー時は null を返す。
 *
 * @returns ログイン中のユーザー情報、または null
 */
export const fetchMe = async (): Promise<User | null> => {
  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    credentials: 'include',
  })
  if (!response.ok) return null
  return response.json() as Promise<User>
}
