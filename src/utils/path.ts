import { flow } from 'fp-ts/function'
import { replace, trim } from 'fp-ts/string'

import { INVALID_CHARACTERS } from '~/constants/index'

const replaceQuotesWithSquareBrackets = flow(
	replace('"', '['),
	replace('"', ']'),
)

const replaceColonsWithHyphen = flow(
	replace(' : ', '-'),
	replace(': ', ' -'),
	replace(':', '-'),
)

export const removeInvalidCharacters = flow(
	replaceQuotesWithSquareBrackets,
	replaceColonsWithHyphen,
	replace(/(\r\n|\n|\r)/gm, ''),
	replace(INVALID_CHARACTERS, ''),
	trim,
)
