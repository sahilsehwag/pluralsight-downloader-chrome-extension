import { LINK_X_URL, LINK_X_LABEL } from '~/constants/index'
import { openInNewTab } from '~/utils'

const openPluralsight = () => openInNewTab(LINK_X_URL.PLURALSIGHT)
const openRepository = () => openInNewTab('LINK_X_URL.REPOSITORY')
const openIssues = () => openInNewTab('LINK_X_URL.REPOSITORY_ISSUES')

export const Links = () => {
	return (
		<div className="links">
			<span className="links__pluralsight" onClick={openPluralsight}>
				{LINK_X_LABEL.PLURALSIGHT}
			</span>
			<span className="links__github" onClick={openRepository}>
				{LINK_X_LABEL.REPOSITORY}
			</span>
			<span className="links__support" onClick={openIssues}>
				{LINK_X_LABEL.REPOSITORY_ISSUES}
			</span>
		</div>
	)
}
