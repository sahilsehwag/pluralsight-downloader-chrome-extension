import { pipe } from 'fp-ts/lib/function'
import { D, A } from '@mobily/ts-belt'

import { ACTION_X_CONFIG } from 'constants/configs'

const renderAction = config => (
	<button
		key={config.key}
		className={config.class}
		title={config.label}
		onClick={config.handleClick}
	>
		{config.label}
	</button>
)

const actionsEl = pipe(ACTION_X_CONFIG, D.values, A.map(renderAction))

export const Actions = () => <div className="controls">{actionsEl}</div>
