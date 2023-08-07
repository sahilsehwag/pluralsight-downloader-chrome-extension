export * from './chrome'

export const sleep = (timeInMs, throwOnAbort = false) => {
	let timeoutId
	let abortHandler

	const promise = new Promise((resolve, reject) => {
		abortHandler = throwOnAbort ? reject : () => resolve()
		timeoutId = setTimeout(() => resolve(), timeInMs)
	})

	promise.abort = () => {
		clearTimeout(timeoutId)
		abortHandler('aborted')
	}
	return promise
}
