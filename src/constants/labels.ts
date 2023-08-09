import {
	STATUSES,
	ACTIONS,
	FIELDS,
	COURSE_TYPES,
	LINKS,
	LEADING_ZERO_OPTIONS,
} from './store'

export const FIELD_X_LABEL = {
	[FIELDS.STATUS]: 'Status',
	[FIELDS.COURSE_TITLE]: 'Course',
	[FIELDS.COURSE_TYPE]: 'Course type',
	[FIELDS.COURSES_ADDED]: 'Courses added',
	[FIELDS.MODULES_COMPLETED]: 'Modules completed',
	[FIELDS.VIDEOS_COMPLETED]: 'Videos completed',
	[FIELDS.LEADING_ZERO]: 'Always add leading zero',
	[FIELDS.SECONDARY_LANGUAGE]: 'Secondary language',
	[FIELDS.DOWNLOAD_DELAY]: 'Download delay',
	[FIELDS.MAX_DELAY]: 'Max download delay',
} as const

export const STATUS_X_LABEL = {
	[STATUSES.DOWNLOADING]: 'Downloading',
	[STATUSES.ERROR]: 'Error',
	[STATUSES.STOPPED]: 'Stopped',
	[STATUSES.WAITING]: 'Waiting',
	[STATUSES.READY]: 'Ready',
	[STATUSES.CANCELLED]: 'Cancelled',
	[STATUSES.DONE]: 'Done',
} as const

export const ACTION_X_LABEL = {
	[ACTIONS.DOWNLOAD_ALL]: 'Download All',
	[ACTIONS.DOWNLOAD_CURRENT]: 'Download Current',
	[ACTIONS.ADD_COURSE]: 'Add course',
	[ACTIONS.SKIP_VIDEO]: 'Skip',
	[ACTIONS.STOP]: 'Stop',
} as const

export const COURSE_TYPE_X_LABEL = {
	[COURSE_TYPES.NEW]: 'New',
	[COURSE_TYPES.OLD]: 'Old',
} as const

export const LINK_X_LABEL = {
	[LINKS.PLURALSIGHT]: 'Pluralsight',
	[LINKS.REPOSITORY]: 'Github',
	[LINKS.REPOSITORY_ISSUES]: 'Report issue',
} as const

export const LEADING_ZERO_OPTIONS_X_LABEL = {
	[LEADING_ZERO_OPTIONS.ALWAYS]: 'Always',
	[LEADING_ZERO_OPTIONS.TEN_OR_MORE]: '10 or more files',
}
