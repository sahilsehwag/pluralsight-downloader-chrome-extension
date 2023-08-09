import { LINKS } from './index'

export const LINK_X_URL = {
	[LINKS.PLURALSIGHT]: 'https://app.pluralsight.com/',
	[LINKS.REPOSITORY]:
		'https://github.com/sahilsehwag/pluralsight-downloader-chrome-extension',
	[LINKS.REPOSITORY_ISSUES]:
		'https://github.com/sahilsehwag/pluralsight-downloader-chrome-extension/issues',
} as const

export const RESOURCE_URLS = {
	// URL to actually get the video URL
	VIDEO: ['https://app.pluralsight.com/video/clips/v3/viewclip'],
	SUBS: ['https://app.pluralsight.com/transcript/api/v1/caption/webvtt'],
}
