import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
// import * as Match from 'pattern-matching-ts/lib/match'
import ERRORS from '~/constants/errors'

const getErrorMessage = ERRORS.unknown
	// Match.matchW('status')({
	// 	500: () => ERRORS.serverError,
	// 	404: () => ERRORS.notFound,
	// 	400: () => ERRORS.badRequest,
	// 	401: () => ERRORS.unauthorized,
	// 	403: () => ERRORS.forbidden,
	// 	429: () => ERRORS.tooManyRequests,
	// 	_:   () => ERRORS.unknown,
	// })

export const fetch = (url, opts = {}) => pipe(
	TE.tryCatch(
		() => window.fetch(url, opts),
		message => new Error(String(message))
	),
	TE.chain((response: Response) =>
		response.ok
			? TE.right(response) // @ts-ignore
			: TE.left(new Error(getErrorMessage(response)))
	),
	TE.chain((response: Response) =>
    TE.tryCatch(
			() => response.json(),
			() => new Error(ERRORS.parsingJsonFailed),
		)
	)
)
