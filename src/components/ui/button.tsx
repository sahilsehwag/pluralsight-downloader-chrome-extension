import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Tooltip } from './tooltip'

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)]',
				destructive: 'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive)/0.9)]',
				outline: 'border border-input bg-background hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]',
				secondary: 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/0.8)]',
				ghost: 'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]',
				link: 'text-[hsl(var(--primary))] underline-offset-4 hover:underline',
				icon: 'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] rounded-full text-xs',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
				iconSmall: 'w-4 h-4',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
	tooltip?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, tooltip, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button'

		const $button = (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		)
		return tooltip ? <Tooltip tooltip={tooltip}>{$button}</Tooltip> : $button
	},
)
Button.displayName = 'Button'

export { Button, buttonVariants }
