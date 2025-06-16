import React from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn(
			'inline-flex h-10 items-center justify-center rounded-md bg-secondary p-1 text-muted-foreground',
			'bg-[hsl(var(--secondary))]',
			className,
		)}
		{...props}
	/>
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(
			'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium',
			'ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
			'disabled:pointer-events-none disabled:opacity-50',
			'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
			'data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-accent-foreground',
			'bg-transparent text-muted-foreground',
			'data-[state=active]:bg-[hsl(var(--background))] data-[state=active]:text-[hsl(var(--foreground))]',
			'data-[state=inactive]:hover:bg-[hsl(var(--accent))] data-[state=inactive]:hover:text-[hsl(var(--accent-foreground))]',
			className,
		)}
		{...props}
	/>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
	React.ElementRef<typeof TabsPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn(
			'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-full',
			className,
		)}
		{...props}
	/>
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
