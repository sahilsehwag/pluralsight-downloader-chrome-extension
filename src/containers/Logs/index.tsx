import React from 'react'
import { clearLogs } from '~/modules/logging'
import { useStorage } from '~/hooks/useStorage'
import { Button } from '~/components/ui/button'
import { EmptyPage } from '~/components/EmtpyPage'
import { mutedText, primaryText } from '~/components/helpers'
import { EraserIcon, FlagIcon, InfoIcon, PartyPopperIcon } from 'lucide-react'

// TODO:
const ACTIONS = [
	{ tooltip: 'Info', onClick: () => {}, icon: <InfoIcon /> },
	{ tooltip: 'Report issue', onClick: () => {}, icon: <FlagIcon /> },
]

interface ActionProps {
	icon: React.ReactNode
	tooltip: string
	onClick: () => void
}

const Action: React.FC<ActionProps> = ({ icon, tooltip, onClick }) => (
	<Button
		tooltip={tooltip}
		onClick={onClick}
		key={tooltip}
		variant="icon"
		size="iconSmall"
		className="invisible group-hover:visible hover:text-primary"
	>
		{icon}
	</Button>
)

interface LogItemProps {
	type: string
	message: string
}

const LogItem: React.FC<LogItemProps> = ({ type, message }) => (
	<div className="group border-b border-muted p-2 flex gap-2 justify-between">
		{primaryText(`[${type}] `)}
		<span>{message}</span>
		<div className="flex gap-2">
			{ACTIONS.map(action => (
				<Action key={action.tooltip} {...action} />
			))}
		</div>
	</div>
)

export const Logs = () => {
	const [logs] = useStorage({
		key: 'logs',
		initial: [],
	})

	return !logs || !logs.length ? (
		<EmptyPage>
			{mutedText('Nothing to see here')}
			<PartyPopperIcon className="h-6 w-6 text-primary pl-2" />
		</EmptyPage>
	) : (
		<>
			<div className="absolute right-5 bottom-5">
				<Button
					tooltip="Clear logs"
					onClick={clearLogs}
					size="icon"
					variant="outline"
				>
					<EraserIcon />
				</Button>
			</div>
			{logs.map(log => (
				<LogItem key={`${log.type}-${log.message}`} {...log} />
			))}
		</>
	)
}
