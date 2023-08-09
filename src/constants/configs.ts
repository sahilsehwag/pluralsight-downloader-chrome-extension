import { D } from '@mobily/ts-belt'

import { ACTIONS, ACTION_X_KEY, FIELDS, FIELD_X_KEY } from './store'
import { ACTION_X_LABEL, FIELD_X_LABEL } from './labels'

import { ValueOf } from 'types'

export type ActionConfig = {
	key: ValueOf<typeof ACTION_X_KEY>
	label: ValueOf<typeof ACTION_X_LABEL>
}

export const ACTION_X_CONFIG = D.map(ACTIONS, action => ({
	key: ACTION_X_KEY[action],
	label: ACTION_X_LABEL[action],
}))

export type FieldConfig = {
	key: ValueOf<typeof FIELD_X_KEY>
	label: ValueOf<typeof FIELD_X_LABEL>
}

export const FIELD_X_CONFIG = D.map(FIELDS, field => ({
	key: FIELD_X_KEY[field],
	label: FIELD_X_LABEL[field],
}))
