import { pipe } from 'fp-ts/function'
import { updateBadge } from '~/utils/chrome'

import { BACKGROUND_ACTIONS, MESSAGES } from '~/constants/actions'
import { messages } from '~/constants/messages'
import { startDownload } from '~/modules/queue'
import { noop } from '~/utils'

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

const isDownloadComplete = state =>
	state && state.current === 'complete' && state.previous === 'in_progress'

// It's already assumed, that when using this function, we're in sync-download
// mode, which implies that no more than one download is present, thus no need to
// to check for the finished download ID
const handleChangeFactory = responseCb => {
	function handleChange({ state }: DownloadDelta) {
		if (isDownloadComplete(state)) {
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

		if (action === BACKGROUND_ACTIONS.DOWNLOAD_SYNC) {
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
	} catch (error) {
		const err = error instanceof Error ? error : new Error(String(error))
		throw new Error(`Exception at download url: ${err.message}`)
	}
}

const actionHandlers = {
	[BACKGROUND_ACTIONS.DOWNLOAD]: downloadFile,
	[BACKGROUND_ACTIONS.DOWNLOAD_SYNC]: downloadFile,
	[BACKGROUND_ACTIONS.BADGE]: ({ payload }) => updateBadge(payload),
}

export const handleTabUpdate = (tabId, changeInfo, tab) => {
	// handlePagePage
	if (changeInfo.status === 'complete' || changeInfo.url) {
		chrome.tabs.sendMessage(tabId, {
			action: MESSAGES.PARSE_COURSE,
		})
		chrome.tabs.sendMessage(tabId, {
			action: MESSAGES.PARSE_VIDEO_ID,
		})
	}
}

// TODO: remove listeners on unmount ???
const handleQueueChange = queue => {
	const { newValue: next, oldValue: prev } = queue
	if (prev?.length === 0 && next?.length !== 0) {
		// TODO:
		startDownload()
	}
}

const handleCourseChange = noop
const handleHistoryChange = noop
const handleLogsChange = noop
const handleSettingsChange = noop

export const handleStorageChange = delta => {
	const { queue, course, history, logs, settings } = delta

	queue && handleQueueChange(queue)
	history && handleHistoryChange(history)
	course && handleCourseChange(course)
	logs && handleLogsChange(course)
	settings && handleSettingsChange(course)
}

export const handleInstall = () => {
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
