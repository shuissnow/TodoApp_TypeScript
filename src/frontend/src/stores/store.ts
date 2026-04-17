import type { Todo } from '../types/todo'
import type { Priority } from '../types/priority'
import type { FilterType } from '../types/filtertype'
import type { ViewType } from '../types/viewtype'
import type { User } from '../types/auth'

export const store = {
  todos: [] as Todo[],
  priorities: [] as Priority[],
  filter: 'all' as FilterType,
  viewType: 'list' as ViewType,
  isLoading: false,
  currentUser: null as User | null,
}

export type AppStore = typeof store
