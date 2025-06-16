import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

export const TooltipProvider = TooltipPrimitive.Provider
export const TooltipTrigger = TooltipPrimitive.Trigger
export const TooltipContainer = TooltipPrimitive.Root
export const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TooltipPrimitive.Content
		ref={ref}
		className={cn(
			'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
			className,
		)}
		{...props}
	/>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export const Tooltip = ({ tooltip, children }) => {
	return (
		<TooltipProvider>
			<TooltipContainer>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent>{tooltip}</TooltipContent>
			</TooltipContainer>
		</TooltipProvider>
	)
}
