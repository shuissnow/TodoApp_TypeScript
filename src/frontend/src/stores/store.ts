import type { Todo } from '../types/todo'
import type { Priority } from '../types/priority'
import type { FilterType } from '../types/filtertype'
import type { ViewType } from '../types/viewtype'

export const store = {
  todos: [] as Todo[],
  priorities: [] as Priority[],
  filter: 'all' as FilterType,
  viewType: 'list' as ViewType,
  isLoading: false,
}

export type AppStore = typeof store
