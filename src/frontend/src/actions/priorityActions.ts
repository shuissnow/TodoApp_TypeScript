import { updatePriority as updatePriorityMaster } from '../services/priorityApi'
import { store } from '../stores/store'

/**
 * 優先度マスタの表示名を更新する
 *
 * @param id - 対象優先度のID
 * @param newName - 新しい表示名
 * @param onRender - 状態変更後に呼び出す再描画コールバック
 */
export const updatePriorityName = async (
  id: string,
  newName: string,
  onRender: () => void,
): Promise<void> => {
  store.isLoading = true
  onRender()
  try {
    const updated = await updatePriorityMaster(id, { name: newName })
    store.priorities = store.priorities.map((p) => (p.id === id ? updated : p))
  } catch (err) {
    console.error('updatePriorityName error:', err)
  } finally {
    store.isLoading = false
    onRender()
  }
}

/**
 * 優先度マスタの文字色を更新する
 *
 * @param id - 対象優先度のID
 * @param newForeground - 新しい文字色（カラーコード）
 * @param onRender - 状態変更後に呼び出す再描画コールバック
 */
export const updatePriorityForeground = async (
  id: string,
  newForeground: string,
  onRender: () => void,
): Promise<void> => {
  store.isLoading = true
  onRender()
  try {
    const updated = await updatePriorityMaster(id, { foregroundColor: newForeground })
    store.priorities = store.priorities.map((p) => (p.id === id ? updated : p))
  } catch (err) {
    console.error('updatePriorityForeground error:', err)
  } finally {
    store.isLoading = false
    onRender()
  }
}

/**
 * 優先度マスタの背景色を更新する
 *
 * @param id - 対象優先度のID
 * @param newBackground - 新しい背景色（カラーコード）
 * @param onRender - 状態変更後に呼び出す再描画コールバック
 */
export const updatePriorityBackground = async (
  id: string,
  newBackground: string,
  onRender: () => void,
): Promise<void> => {
  store.isLoading = true
  onRender()
  try {
    const updated = await updatePriorityMaster(id, { backgroundColor: newBackground })
    store.priorities = store.priorities.map((p) => (p.id === id ? updated : p))
  } catch (err) {
    console.error('updatePriorityBackground error:', err)
  } finally {
    store.isLoading = false
    onRender()
  }
}

/**
 * 優先度マスタの有効/無効状態を反転する
 *
 * @param id - 対象優先度のID
 * @param onRender - 状態変更後に呼び出す再描画コールバック
 */
export const togglePriorityStatus = async (id: string, onRender: () => void): Promise<void> => {
  const target = store.priorities.find((p) => p.id === id)
  if (!target) return

  store.isLoading = true
  onRender()
  try {
    const updated = await updatePriorityMaster(id, { isDeleted: !target.isDeleted })
    store.priorities = store.priorities.map((p) => (p.id === id ? updated : p))
  } catch (err) {
    console.error('togglePriorityStatus error:', err)
  } finally {
    store.isLoading = false
    onRender()
  }
}
