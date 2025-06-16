import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { TABS } from './constants'
import { ThemeProvider } from '@/contexts/theme'
import { ThemeSwitcher } from '~/components/ThemeSwitcher'

export const Layout = () => (
	<div className="bg-background text-foreground dark h-[600px] overflow-hidden p-5 pb-16">
		<ThemeProvider>
			<ThemeSwitcher />
		</ThemeProvider>
		<Tabs defaultValue={TABS.DASHBOARD.value} className="h-full">
			<TabsList>
				{Object.values(TABS).map(({ value, label }) => (
					<TabsTrigger key={value} value={value}>
						{label}
					</TabsTrigger>
				))}
			</TabsList>
			<>
				{Object.values(TABS).map(({ value, component: Component }) => (
					<TabsContent key={value} value={value}>
						<Component />
					</TabsContent>
				))}
			</>
		</Tabs>
	</div>
)
