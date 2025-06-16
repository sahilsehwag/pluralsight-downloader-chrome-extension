import { Coffee, Flag, Github, PlayCircle } from 'lucide-react'

import { openInNewTab } from '~/utils/chrome'
import { Button } from '~/components/ui/button'
import { LINKS } from '~/constants/urls'

type LinkProps = {
	href: string
	icon: JSX.Element
	tooltip: string
}

const Link = ({ href, icon, tooltip }: LinkProps) => (
	<Button
		tooltip={tooltip}
		size="icon"
		variant="icon"
		className="hover:text-[hsl(var(--primary))]"
		onClick={() => openInNewTab(href)}
	>
		{icon}
	</Button>
)

export const Links = () => (
	<div className="h-full flex justify-center items-end">
		<Link
			tooltip="Open Pluralsight"
			href={LINKS.PLURALSIGHT}
			icon={<PlayCircle />}
		/>
		<Link tooltip="Open Github" href={LINKS.REPOSITORY} icon={<Github />} />
		<Link tooltip="Report an issue" href={LINKS.ISSUES} icon={<Flag />} />
		<Link
			tooltip="Buy me a coffee"
			href={LINKS.BUY_ME_A_COFFEE}
			icon={<Coffee />}
		/>{' '}
		{/* TODO: */}
	</div>
)
