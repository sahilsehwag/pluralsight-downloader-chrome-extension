import './index.scss'

import { Status } from 'components/Status'
import { Settings } from 'components/Settings'
import { Actions } from 'components/Actions'
import { Links } from 'components/Links'

export const App = () => (
	<div className="app">
		<Status />
		<Settings />
		<Actions />
		<Links />
	</div>
)
