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
		component: Dashboard,
	},
	QUEUE: {
		value: 'queue',
		label: 'Queue',
		component: Queue,
	},
	HISTORY: {
		value: 'history',
		label: 'History',
		component: History,
	},
	SETTINGS: {
		value: 'settings',
		label: 'Settings',
		component: Settings,
	},
	LOGS: {
		value: 'logs',
		label: 'Logs',
		component: Logs,
	},
	ABOUT: {
		value: 'about',
		label: 'About',
		component: Links,
	},
} as const
