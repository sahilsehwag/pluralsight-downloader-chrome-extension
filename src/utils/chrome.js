//tabs
export const openInNewTab = url => chrome.tabs.create({ url })

//storage
export const get = (...args) => chrome.storage.sync.get(...args)
export const set = (...args) => chrome.storage.sync.set(...args)

//runtime
export const sendMessage = (...args) => chrome.runtime.sendMessage(...args)
