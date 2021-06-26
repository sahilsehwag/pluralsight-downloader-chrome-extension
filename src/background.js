flag = false
filePath = ''
let listenerInstance = undefined

// It's already assumed, that when using this function, we're in sync. download
// mode, which implies that no more than one download is present, thus no need to
// to check for the finished download ID
var onChangeFactory =
	(responseCb) =>
	({ state }) => {
		if (
			state &&
			state.current === 'complete' &&
			state.previous === 'in_progress'
		) {
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
	chrome.storage.sync.set({ Status: 'Ready' }, undefined)
	chrome.storage.sync.set({ CourseTitle: '' }, undefined)
	chrome.storage.sync.set({ speedPercent: '80' }, undefined)
	chrome.storage.sync.set({ Completion_Module: [0, 0] }, undefined)
	chrome.storage.sync.set({ Completion_Video: [0, 0] }, undefined)
	chrome.storage.sync.set({ maxDuration: '0' }, undefined)
	chrome.storage.sync.set({ btnStop: false }, undefined)
	chrome.storage.sync.set({ btnSkip: false }, undefined)
	chrome.storage.sync.set({ btnDwnAll: false }, undefined)
	chrome.storage.sync.set({ btnDwnCur: false }, undefined)
	chrome.storage.sync.set({ AddedCourseCount: '0' }, undefined)

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
