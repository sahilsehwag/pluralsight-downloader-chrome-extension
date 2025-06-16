import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { matchW } from '~/utils/general'
import ERRORS from '~/constants/errors'

const getErrorMessage = matchW('status')({
	500: () => ERRORS.serverError,
	404: () => ERRORS.notFound,
	400: () => ERRORS.badRequest,
	401: () => ERRORS.unauthorized,
	403: () => ERRORS.forbidden,
	429: () => ERRORS.tooManyRequests,
	_: () => ERRORS.unknown,
})

type Fetch = (url: string, opts?: RequestInit) => TE.TaskEither<Error, any>

export const fetch: Fetch = (url, opts) =>
	pipe(
		TE.tryCatch(
			() => window.fetch(url, opts),
			message => new Error(String(message)),
		),
		TE.chain(response =>
			response.ok
				? TE.right(response) // @ts-ignore
				: TE.left(new Error(getErrorMessage(response))),
		),
		TE.chain(response =>
			TE.tryCatch(
				() => response.json(),
				() => new Error(ERRORS.parsingJsonFailed),
			),
		),
	)
