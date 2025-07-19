import {
	handleDeterminingFilename,
	handleInstall,
	handleMessage,
	handleTabUpdate,
	handleStorageChange,
} from './handlers'

main()

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
export function main() {
	chrome.runtime.onInstalled.addListener(handleInstall)
	chrome.runtime.onMessage.addListener(handleMessage)
	chrome.runtime.onMessageExternal.addListener(handleMessage)
	chrome.storage.onChanged.addListener(handleStorageChange)
	chrome.tabs.onUpdated.addListener(handleTabUpdate)
	chrome.downloads.onDeterminingFilename.addListener(handleDeterminingFilename)
}
