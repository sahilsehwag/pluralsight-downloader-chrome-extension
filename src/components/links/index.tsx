import L from 'react-on-lambda'

import { CoffeeIcon, FlagIcon, GithubIcon, PlayCircleIcon } from 'lucide-react'

import { openInNewTab } from '~/utils/chrome'
import { Button } from '~/components/ui/button'

const pluralsight = 'https://app.pluralsight.com'
const repository  = 'https://github.com/sahilsehwag/pluralsight-downloader-chrome-extension'
const issues      = 'https://github.com/sahilsehwag/pluralsight-downloader-chrome-extension/issues'

const link = ({ href, icon, tooltip }) =>
	Button({
		tooltip,
		size: 'icon',
		variant: 'icon',
		onClick: () => openInNewTab(href),
	}, icon)

export const Links = L(() =>
	L.div({
		className: 'h-full flex justify-center items-end',
	})(
		link({ tooltip: 'Open Pluralsight', href: pluralsight, icon: <PlayCircleIcon /> }),
		link({ tooltip: 'Open Github',      href: repository,  icon: <GithubIcon /> }),
		link({ tooltip: 'Report an issue',  href: issues,      icon: <FlagIcon /> }),
		link({ tooltip: 'Buy me a coffee',  href: issues,      icon: <CoffeeIcon /> }), //TODO:
	),
)
