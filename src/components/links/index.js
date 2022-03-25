import { GithubIcon } from 'icons'
import { openInNewTab } from 'utils'

const openPluralsight = () => openInNewTab('https://app.pluralsight.com/')
const openRepository = () => openInNewTab('https://github.com/sahilsehwag/pluralsight-downloader-chrome-extension')
const openIssues = () => openInNewTab('https://github.com/sahilsehwag/pluralsight-downloader-chrome-extension/issues')

export const Links = () => {
	return (
		<div className="links">
			<span className="links__pluralsight" onClick={openPluralsight}>
				<GithubIcon />
			</span>
			<span className="links__github" onClick={openRepository}>
				<GithubIcon />
			</span>
			<span className="links__support" onClick={openIssues}>
				<GithubIcon />
			</span>
		</div>
	)
}
