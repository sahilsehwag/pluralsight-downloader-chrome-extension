import { LOCALE_X_LANGUAGE } from '~/constants/locales'

export const renderLanguageOptions = () =>
	Object.entries(LOCALE_X_LANGUAGE).map(([locale, language]) => (
		<option key={locale} value={locale}>
			{language}
		</option>
	))
