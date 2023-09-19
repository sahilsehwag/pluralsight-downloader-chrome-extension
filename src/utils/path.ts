import { flow } from 'fp-ts/function'
import { replace, trim } from 'fp-ts/string'

const INVALID_CHARACTERS = /[/*?<>|']/g

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
