import React from 'react'
import { Command, CommandInput, CommandList, CommandItem } from '../ui/command'

export const CommandBar = () => {
	return (
		<Command>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandItem>First Command</CommandItem>
				<CommandItem>Second Command</CommandItem>
			</CommandList>
		</Command>
	)
}
