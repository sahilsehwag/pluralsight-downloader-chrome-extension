/*global chrome*/

import { set } from 'utils'

main()
// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
export function main() {
	let flag = false
	let filePath = ''
	let listenerInstance = undefined

	// It's already assumed, that when using this function, we're in sync. download
	// mode, which implies that no more than one download is present, thus no need to
	// to check for the finished download ID
	var onChangeFactory =
		responseCb =>
		({ state }) => {
			if (state && state.current === 'complete' && state.previous === 'in_progress') {
				chrome.downloads.onChanged.removeListener(listenerInstance)
				responseCb({ actionStatus: 'File downloaded successfully' })
			}
		}

	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		if (request.action === 'download' || request.action === 'download-sync') {
			filePath = request.filePath

			flag = true
			try {
				chrome.downloads.download({
					url: request.link,
				})

				if (request.action === 'download-sync') {
					listenerInstance = onChangeFactory(sendResponse)
					chrome.downloads.onChanged.addListener(listenerInstance)
					// This is used to send the response asynchronously,
					// check: https://developer.chrome.com/extensions/messaging
					return true
				} else {
					sendResponse({
						actionStatus: `${filePath} DOWNLOADED!!!`,
					})
				}
			} catch (err) {
				throw 'Exception at download url'
				//alert('Error: ' + err.message);
			}
		} else if (request.action === 'badge') {
			chrome.browserAction.setBadgeBackgroundColor({
				color: [122, 186, 122, 255],
			})
			chrome.browserAction.setBadgeText({ text: `${request.text}` })
		}
	})

	chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
		if (flag) {
			flag = false
			suggest({
				filename: filePath,
			})
		}
	})

	chrome.runtime.onInstalled.addListener(function () {
		set({ extensionStatus: 'Ready' }, undefined)
		set({ courseTitle: '' }, undefined)
		set({ speedPercent: '80' }, undefined)
		set({ modulesCompleted: [0, 0] }, undefined)
		set({ videosCompleted: [0, 0] }, undefined)
		set({ maxDuration: '0' }, undefined)
		set({ btnStop: false }, undefined)
		set({ btnSkip: false }, undefined)
		set({ btnDwnAll: false }, undefined)
		set({ btnDwnCur: false }, undefined)
		set({ noOfCoursesAdded: '0' }, undefined)

		chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
			chrome.declarativeContent.onPageChanged.addRules([
				{
					conditions: [
						new chrome.declarativeContent.PageStateMatcher({
							pageUrl: { hostContains: 'pluralsight.com' },
						}),
					],
					actions: [new chrome.declarativeContent.ShowPageAction()],
				},
			])
		})
	})
}
