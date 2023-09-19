import L from 'react-on-lambda'
import { Settings as SettingsType } from '~/entities/Store'
import { useStorage } from '~/hooks/useStorage'

const DEFAULT_SETTINGS: SettingsType = {
	theme: 'ROSE',
  primaryLocale: 'en',
  secondaryLocale: 'en',
	downloadDelay: 10,
	isDarkMode: true,
	notifications: {
    error: true,
		download: 'COURSE',
		update: true
	},
}

export const Settings = L(
	() => {
		const [settings, setSettings] = useStorage({
			key: 'settings',
			initial: DEFAULT_SETTINGS,
		})

		if (!settings) {
			return null
		}

		return L.div('Settings!!!')
	}
)
