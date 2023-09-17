import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'

import ERRORS from '~/constants/errors'

export const fetch = (url, opts = {}) => pipe(
	TE.tryCatch(
		() => window.fetch(url, opts),
		message => new Error(String(message))
	),
	TE.chain((response: Response) =>
		response.ok
			? TE.right(response)
			: TE.left(new Error(ERRORS.requestFailed)),
	),
	TE.chain((response: Response) =>
    TE.tryCatch(
			response.json,
			() => new Error(ERRORS.parsingJsonFailed),
		)
	)
)
