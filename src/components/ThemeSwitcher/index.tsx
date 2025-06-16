import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/theme'
import { Button } from '@/components/ui/button'

export const ThemeSwitcher = () => {
	const { theme, setTheme } = useTheme()

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			className="absolute bottom-[1rem] right-[1rem] hover:text-[hsl(var(--primary))]"
		>
			<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
