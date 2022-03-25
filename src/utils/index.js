import { curry } from 'ramda'

export * from './chrome'

export const sleep = curry((ms, throwOnAbort = false) => {
	let timeoutId
	let abortHandler

	const promise = new Promise((resolve, reject) => {
		abortHandler = throwOnAbort ? reject : () => resolve()
		timeoutId = setTimeout(() => resolve(), ms)
	})

	promise.abort = () => {
		clearTimeout(timeoutId)
		abortHandler('aborted')
	}
	return promise
})
