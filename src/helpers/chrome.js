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
