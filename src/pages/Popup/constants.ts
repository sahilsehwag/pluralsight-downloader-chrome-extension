import { Dashboard } from '~/containers/Dashboard'
import { Queue } from '~/containers/Queue'
import { History } from '~/containers/History'
import { Settings } from '~/containers/Settings'
import { Logs } from '~/containers/Logs'
import { Links } from '~/components/links'

export const TABS = {
  DASHBOARD: {
    value: 'dashboard',
    label: 'Dashboard',
    element: Dashboard(),
  },
  QUEUE: {
    value: 'queue',
    label: 'Queue',
    element: Queue(),
  },
  HISTORY: {
    value: 'history',
    label: 'History',
    element: History(),
  },
  SETTINGS: {
    value: 'settings',
    label: 'Settings',
    element: Settings(),
  },
  LOGS: {
    value: 'logs',
    label: 'Logs',
    element: Logs(),
  },
  ABOUT: {
    value: 'about',
    label: 'About',
    element: Links(),
  },
} as const

