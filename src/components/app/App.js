/*global chrome*/
import { Status } from 'components/status'
import { Settings } from 'components/settings'
import { Actions } from 'components/actions'
import { Links } from 'components/links'

import './App.scss'

export const App = () => (
	<div className="app">
		<Status />
		<Settings />
		<Actions />
		<Links />
	</div>
)
