import { D } from '@mobily/ts-belt'

import { ACTIONS, ACTION_X_KEY, FIELDS, FIELD_X_KEY } from './general'

import { ACTION_X_LABEL, FIELD_X_LABEL } from './labels'

import { sendAction } from 'utils'

const ACTION_X_CLASSNAME = {
	[ACTIONS.DOWNLOAD_CURRENT]: 'downloa__current',
	[ACTIONS.DOWNLOAD_ALL]: 'download__all',
	[ACTIONS.ADD_COURSE]: 'download__add-course',
	[ACTIONS.SKIP_VIDEO]: 'download__skip-video',
	[ACTIONS.STOP]: 'download__stop',
} as const

export const ACTION_X_CONFIG = D.map(ACTIONS, action => ({
	key: ACTION_X_KEY[action],
	label: ACTION_X_LABEL[action],
	class: ACTION_X_CLASSNAME[action],
	handleClick: () => sendAction(ACTION_X_KEY[action]),
}))

export const FIELD_X_CONFIG = D.map(FIELDS, action => ({
	key: FIELD_X_KEY[action],
	label: FIELD_X_LABEL[action],
}))
