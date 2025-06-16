import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react'

// Define the shape of the context
interface ThemeContextType {
	theme: 'light' | 'dark'
	setTheme: (theme: 'light' | 'dark') => void
	toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
	children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
		if (typeof window !== 'undefined') {
			return (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
		}
		return 'light'
	})

	useEffect(() => {
		document.documentElement.classList.remove(
			theme === 'light' ? 'dark' : 'light',
		)
		document.documentElement.classList.add(theme)
		localStorage.setItem('theme', theme)
	}, [theme])

	const setTheme = (newTheme: 'light' | 'dark') => {
		setThemeState(newTheme)
	}

	const toggleTheme = () => {
		setThemeState(prev => (prev === 'light' ? 'dark' : 'light'))
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}
