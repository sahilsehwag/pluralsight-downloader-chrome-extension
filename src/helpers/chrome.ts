import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

import { BACKGROUND_ACTIONS } from '~/constants'
import { sendMessageToRuntime } from '~/utils'

export const downloadFile = ({ url, filename }) =>
	sendMessageToRuntime({
		action: BACKGROUND_ACTIONS.DOWNLOAD_SYNC,
		payload: { url, filename },
	})

// Query the proportion of the already downloaded part of the file
// Passes a ratio between 0 and 1 (or -1 if unknown) to the callback
export const getProgress =
	callback =>
	({ downloadId }) =>
		chrome.downloads.search(
			{ id: downloadId },
			// @ts-ignore
			({ bytesReceived, totalBytes }) =>
				pipe(
					totalBytes,
					O.fromPredicate(totalBytes => totalBytes > 0),
					O.map(totalBytes => bytesReceived / totalBytes),
					O.map(callback),
				),
		)
