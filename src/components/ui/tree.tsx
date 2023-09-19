import React from 'react'
import L from 'react-on-lambda'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils'
import { ChevronRight, Folder, FolderPlus } from 'lucide-react'

export const Tree = L(({ data }: { data: any[] | any }) => {
	return (
		<ul role="list" className="space-y-1">
			{data instanceof Array ? (
				data.map(item => (
					<li key={item.id}>
						{item.children ? (
							<a href="#">
								<AccordionPrimitive.Root type="single" collapsible>
									<AccordionPrimitive.Item value="item-1">
										<AccordionTrigger>
											<FolderPlus
												className="h-6 w-6 shrink-0 mr-5"
												aria-hidden="true"
											/>
											{item.name}
										</AccordionTrigger>
										<AccordionContent className="pl-4">
											<Tree data={item.children ? item.children : item.name} />
										</AccordionContent>
									</AccordionPrimitive.Item>
								</AccordionPrimitive.Root>
							</a>
						) : (
							<Leaf name={item.name} />
						)}
					</li>
				))
			) : (
				<li>
					<Leaf name={data.name} />
				</li>
			)}
		</ul>
	)
})

function Leaf({ name }: { name: string }) {
	return (
		<a href="#" className={'flex flex-1 items-center py-4 font-medium'}>
			<ChevronRight className="h-4 w-4 shrink-0 opacity-0" />
			<Folder className="h-6 w-6 shrink-0 mr-5" aria-hidden="true" />
			{name}
		</a>
	)
}
const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Header className="flex">
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				'flex flex-1 items-center py-4 font-medium transition-all first:[&[data-state=open]>svg]:rotate-90',
				className,
			)}
			{...props}
		>
			<ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
			{children}
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className={cn(
			'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
			className,
		)}
		{...props}
	>
		<div className="pb-4 pt-0">{children}</div>
	</AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName
