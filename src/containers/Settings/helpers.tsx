import { pipe } from 'fp-ts/function'
import { D } from '@mobily/ts-belt'
import { ValueOf } from 'type-fest'

import { LOCALE_X_LANGUAGE } from '~/constants/locales'

const renderOption = (
	locale: keyof typeof LOCALE_X_LANGUAGE,
	language: ValueOf<typeof LOCALE_X_LANGUAGE>,
) => (
	<option key={locale} value={locale}>
		{language}
	</option>
)

export const renderLanguageOptions = () =>
	pipe(
		LOCALE_X_LANGUAGE,
		D.mapWithKey(renderOption),
		D.values
	)
