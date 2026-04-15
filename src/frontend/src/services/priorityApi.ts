import type { Priority } from '../types/priority'
import { BASE_URL } from './config'

/**
 * 
 * @param id 優先度を作成します。
 * @param name 
 * @param foregroundColor 
 * @param backgroundColor 
 * @param displayOrder 
 * @returns 
 */
export const createPriority = async (
  id: string,
  name: string,
  foregroundColor: string,
  backgroundColor: string,
  displayOrder: number,
): Promise<Priority> => {
  const response: Response = await fetch(`${BASE_URL}/api/priorities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id,
      name,
      foregroundColor,
      backgroundColor,
      displayOrder,
      isDeleted: false,
    }),
  })

  if (!response.ok) {
    throw new Error(`${createPriority} failed: ${response.status}`)
  }

  return response.json() as Promise<Priority>
}

/**
 * 優先度マスタ一覧を取得します。
 *
 *  @returns Priority配列（display_order 昇順）
 * @throws APIエラー時にErrorをスロー
 */
export const fetchAllPriorities = async (): Promise<Priority[]> => {
  const response: Response = await fetch(`${BASE_URL}/api/priorities/all`)
  if (!response.ok) {
    throw new Error(`${fetchAllPriorities} failed: ${response.status}`)
  }
  return response.json() as Promise<Priority[]>
}

/**
 * 有効な優先度マスタ一覧を取得します。
 *
 * @returns Priority配列（display_order 昇順）
 * @throws APIエラー時にErrorをスロー
 */
export const fetchActivePriorities = async (): Promise<Priority[]> => {
  const response: Response = await fetch(`${BASE_URL}/api/priorities`)
  if (!response.ok) {
    throw new Error(`${fetchActivePriorities.name} failed: ${response.status}`)
  }
  return response.json() as Promise<Priority[]>
}

/**
 * 優先度マスタを更新します。
 *
 * @param id 優先度マスタID
 * @param patch 更新データ
 * @returns 優先度マスタ
 */
export const updatePriority = async (
  id: string,
  patch: { isDeleted?: boolean; name?: string; foregroundColor?: string; backgroundColor?: string },
): Promise<Priority> => {
  const response: Response = await fetch(`${BASE_URL}/api/priorities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })

  if (!response.ok) {
    throw new Error(`${updatePriority} failed: ${response.status}`)
  }
  return response.json() as Promise<Priority>
}
