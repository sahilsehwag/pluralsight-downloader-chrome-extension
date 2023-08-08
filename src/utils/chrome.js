//tabs
export const openInNewTab = url => chrome.tabs.create({ url })

//storage
export const getAll = (...args) => chrome.storage.sync.get(...args)
export const setAll = (...args) => chrome.storage.sync.set(...args)

export const get = key => getAll(key).then(data => data[key])
export const set = (key, value) => setAll({ [key]: value })

//runtime
export const sendMessage = (...args) => chrome.runtime.sendMessage(...args)

export const sendAction = cmd => {
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		chrome.tabs.sendMessage(tabs[0].id, {
			action: {
				cmd,
				state: true,
			},
		})
	})
}
