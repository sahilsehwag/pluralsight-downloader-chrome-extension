import React from 'react'

export const ReportIssue = () => {
	return (
		<a
			href="https://github.com/sahilsehwag/pluralsight-downloader-chrome-extension/issues"
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center gap-2 rounded bg-red-500 px-3 py-1 text-sm font-semibold text-white hover:bg-red-400"
		>
			<span>Report an issue</span>
			<span role="img" aria-label="bug">
				🐞
			</span>
		</a>
	)
}
