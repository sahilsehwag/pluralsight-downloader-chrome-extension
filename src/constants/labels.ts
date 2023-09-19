import { ACTIONS } from './actions'

export const ACTION_X_LABEL = {
	[ACTIONS.DOWNLOAD_COURSE]: 'Download Course',
	[ACTIONS.DOWNLOAD_SECTION]: 'Download Section',
	[ACTIONS.DOWNLOAD_VIDEO]: 'Download Video',
	[ACTIONS.PAUSE_COURSE]: 'Pause Course',
	[ACTIONS.PAUSE_SECTION]: 'Pause Section',
	[ACTIONS.PAUSE_VIDEO]: 'Pause Video',
	[ACTIONS.RESUME_COURSE]: 'Resume Course',
	[ACTIONS.RESUME_SECTION]: 'Resume Section',
	[ACTIONS.RESUME_VIDEO]: 'Resume Video',
	[ACTIONS.CANCEL_COURSE]: 'Cancel Course',
	[ACTIONS.CANCEL_SECTION]: 'Cancel Section',
	[ACTIONS.CANCEL_VIDEO]: 'Cancel Video',
} as const
