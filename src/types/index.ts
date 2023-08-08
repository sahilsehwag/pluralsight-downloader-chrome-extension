import {
	COURSE_TYPES,
	FIELD_X_KEY,
	LEADING_ZERO_OPTIONS,
	STATUSES,
	LOCALE_X_LANGUAGE,
} from 'constants/index'
import { ValueOf } from './utils'

export * from './utils'

export type Store = {
	[FIELD_X_KEY.STATUS]: ValueOf<typeof STATUSES>
	[FIELD_X_KEY.COURSE_TITLE]: string
	[FIELD_X_KEY.COURSE_TYPE]: ValueOf<typeof COURSE_TYPES>
	[FIELD_X_KEY.COURSES_ADDED]: number
	[FIELD_X_KEY.MODULES_COMPLETED]: number
	[FIELD_X_KEY.VIDEOS_COMPLETED]: number
	[FIELD_X_KEY.LEADING_ZERO]: ValueOf<typeof LEADING_ZERO_OPTIONS>
	[FIELD_X_KEY.DOWNLOAD_DELAY]: number
	[FIELD_X_KEY.MAX_DELAY]: number
	[FIELD_X_KEY.SECONDARY_LANGUAGE]: ValueOf<typeof LOCALE_X_LANGUAGE>
}
