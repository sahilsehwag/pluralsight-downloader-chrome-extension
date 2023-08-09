import * as T from 'fp-ts/Task'
import { BG_ACTIONS } from 'constants/store'

type ColorArray = chrome.browserAction.ColorArray
type Tab = chrome.tabs.Tab

//tabs
export const openInNewTab = (url: string) =>
	chrome.tabs.create({ url })

//storage
//export const getAll = chrome.storage.sync.get
//export const setAll = chrome.storage.sync.set

export const get = (key: string) =>
	chrome.storage.sync
		.get(key)
		.then(store => store[key])

export const set = (key: string, value: any) =>
	chrome.storage.sync.set({
		[key]: value,
	})

export const getActiveTab = () =>
	chrome.tabs
		.query({
			active: true,
			currentWindow: true,
		})
		.then(tabs => tabs[0])

export const sendAction = (cmd: string) =>
	getActiveTab().then((tab: Tab) =>
		chrome.tabs.sendMessage(tab.id as number, {
			action: {
				cmd,
				state: true,
			},
		}),
	)

export const updateBadge = ({
	text,
	color = [122, 186, 122, 255] as ColorArray,
}) => {
	chrome.browserAction.setBadgeBackgroundColor({ color })
	chrome.browserAction.setBadgeText({ text })
}

export const downloadFile = ({ url, filename }): T.Task<void> => () =>
	chrome.runtime.sendMessage({
		action: BG_ACTIONS.DOWNLOAD_SYNC,
		payload: {
			url,
			filename,
		},
	})
