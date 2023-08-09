import { pipe } from 'fp-ts/function'
import { set, updateBadge } from 'utils'

import { STATUSES, BG_ACTIONS, FIELD_X_KEY } from 'constants/index'
import messages from 'constants/messages'

const {
	STATUS,
	COURSE_TITLE,
	DOWNLOAD_DELAY,
	MAX_DELAY,
	MODULES_COMPLETED,
	VIDEOS_COMPLETED,
	COURSES_ADDED,
} = FIELD_X_KEY

type DownloadDelta = chrome.downloads.DownloadDelta

const { onPageChanged, ShowPageAction, PageStateMatcher } =
	chrome.declarativeContent

// __GLOBALS__
let __IS_DOWNLOADING = false
let __FILENAME = ''

const showPageActionOnPluralsight = () => {
	onPageChanged.removeRules(undefined, () => {
		onPageChanged.addRules([
			{
				conditions: [
					new PageStateMatcher({
						pageUrl: { hostContains: 'pluralsight.com' },
					}),
				],
				actions: [new ShowPageAction()],
			},
		])
	})
}

const isDownloadCompleted = (state: DownloadDelta['state']) =>
	state && state.current === 'complete' && state.previous === 'in_progress'

// It's already assumed, that when using this function, we're in sync-download
// mode, which implies that no more than one download is present, thus no need to
// to check for the finished download ID
const handleChangeFactory = responseCb => {
	function handleChange({ state }: DownloadDelta) {
		if (isDownloadCompleted(state)) {
			chrome.downloads.onChanged.removeListener(handleChange)
			responseCb({ actionStatus: messages.fileDownloadedSuccessfully })
		}
	}
	return handleChange
}

const downloadFile = ({ action, payload, sendResponse }) => {
	const { url, filename } = payload

	__IS_DOWNLOADING = true
	__FILENAME = filename

	try {
		chrome.downloads.download({ url })

		if (action === BG_ACTIONS.DOWNLOAD_SYNC) {
			pipe(
				sendResponse,
				handleChangeFactory,
				chrome.downloads.onChanged.addListener,
			)
		} else {
			sendResponse({
				actionStatus: `${filename} DOWNLOADED!!!`,
			})
		}
	} catch (err: unknown) {
		throw `Exception at download url ${(err as Error).message}`
	}
}

const actionHandlers = {
	[BG_ACTIONS.DOWNLOAD]: downloadFile,
	[BG_ACTIONS.DOWNLOAD_SYNC]: downloadFile,
	[BG_ACTIONS.BADGE]: ({ payload }) => updateBadge(payload),
}

export const handleInstall = () => {
	set(STATUS, STATUSES.READY)
	set(COURSE_TITLE, '')
	set(DOWNLOAD_DELAY, 80)
	set(MODULES_COMPLETED, [0, 0])
	set(VIDEOS_COMPLETED, [0, 0])
	set(MAX_DELAY, 0)
	set(COURSES_ADDED, 0)

	showPageActionOnPluralsight()
}

export const handleMessage = ({ action, payload }, sender, sendResponse) =>
	actionHandlers[action]?.({ action, payload, sender, sendResponse })

export const handleDeterminingFilename = (item, suggest) => {
	if (__IS_DOWNLOADING) {
		__IS_DOWNLOADING = false
		suggest({ filename: __FILENAME })
	}
}
