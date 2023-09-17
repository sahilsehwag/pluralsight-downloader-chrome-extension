import './index.scss'

import { Status } from '~/components/Status'
import { Settings } from '~/containers/Settings'
import { Actions } from '~/components/Actions'
import { Links } from '~/components/Links'

export const Popup = () => (
	<div className="app">
		<Status />
		<Settings />
		<Actions />
		<Links />
	</div>
)
