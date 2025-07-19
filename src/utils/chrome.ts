import { pipe } from 'fp-ts/function'
import * as TO from 'fp-ts/TaskOption'
import * as A from 'fp-ts/Array'
import * as T from 'fp-ts/Task'
import { logError } from '~/modules/logging'

// message
type Message = {
	action: string
	payload?: Record<string, unknown>
}

export const sendMessageToRuntime =
	(message: Message): T.Task<void> =>
	() =>
		chrome.runtime.sendMessage(chrome.runtime.id, message)

export const sendMessageToTab =
	(tabId: number) =>
	(message: Message): T.Task<void> =>
	() =>
		chrome.tabs.sendMessage(tabId, message).catch(e => console.log('######', e))

// tabs
export const openInNewTab = (url: string) => chrome.tabs.create({ url })

const getActiveTab = pipe(
	() => chrome.tabs.query({ active: true, currentWindow: true }),
	T.map(A.head),
)

export const sendAction = (action: string) =>
	pipe(
		getActiveTab,
		TO.flatMapTask(tab => sendMessageToTab(tab.id as number)({ action })),
	)

// badge
export const updateBadge = ({
	text,
	color = [122, 186, 122, 255] as chrome.browserAction.ColorArray,
}) => {
	chrome.browserAction.setBadgeBackgroundColor({ color })
	chrome.browserAction.setBadgeText({ text })
}
