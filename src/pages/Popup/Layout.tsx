import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { TABS } from './constants'
import { ThemeProvider } from '@/contexts/theme'

export const Layout = () => (
	<ThemeProvider>
		<div className="bg-background text-foreground dark h-[600px] overflow-hidden p-5 pb-16">
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
	</ThemeProvider>
)
