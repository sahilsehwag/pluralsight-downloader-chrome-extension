import { pipe } from 'fp-ts/function'
import { D } from '@mobily/ts-belt'

import { ACTIONS, ACTION_X_KEY } from 'constants/store'
import { ACTION_X_CONFIG, ActionConfig } from 'constants/configs'
import { sendAction } from 'utils'

const ACTION_X_CLASSNAME = {
	[ACTIONS.DOWNLOAD_CURRENT]: 'download__current',
	[ACTIONS.DOWNLOAD_ALL]: 'download__all',
	[ACTIONS.ADD_COURSE]: 'download__add-course',
	[ACTIONS.SKIP_VIDEO]: 'download__skip-video',
	[ACTIONS.STOP]: 'download__stop',
} as const

const renderAction = (action: string, config: ActionConfig) => (
	<button
		key={config.key}
		className={ACTION_X_CLASSNAME[action]}
		title={config.label}
		onClick={() => sendAction(ACTION_X_KEY[action])}
	>
		{config.label}
	</button>
)

export const Actions = () => (
	<div className="controls">
		{pipe(ACTION_X_CONFIG, D.mapWithKey(renderAction), D.values)}
	</div>
)
