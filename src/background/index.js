import {
	handleDeterminingFilename,
	handleInstall,
	handleMessage,
} from './handlers'

main()

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
export function main() {
	chrome.runtime.onInstalled.addListener(handleInstall)
	chrome.runtime.onMessage.addListener(handleMessage)
	chrome.downloads.onDeterminingFilename.addListener(handleDeterminingFilename)
}
