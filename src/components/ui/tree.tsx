import React from 'react'
import { ChevronRight, Folder, FolderPlus } from 'lucide-react'
import { Course } from '~/entities/Course'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils'

interface TreeProps {
	data: Course
}

export const Tree = ({ data }: TreeProps) => {
	return (
		<ul role="list" className="space-y-1">
			<li key={data.id}>
				<a href="#">
					<AccordionPrimitive.Root type="single" collapsible>
						<AccordionPrimitive.Item value={data.id}>
							<AccordionTrigger>
								<FolderPlus
									className="h-6 w-6 shrink-0 mr-5"
									aria-hidden="true"
								/>
								{data.name}
							</AccordionTrigger>
							<AccordionContent className="pl-4">
								{data.sections.map(section => (
									<div key={section.id}>
										<AccordionPrimitive.Root type="single" collapsible>
											<AccordionPrimitive.Item value={section.id}>
												<AccordionTrigger>
													<FolderPlus
														className="h-6 w-6 shrink-0 mr-5"
														aria-hidden="true"
													/>
													{section.name}
												</AccordionTrigger>
												<AccordionContent className="pl-4">
													{section.videos.map(video => (
														<Leaf key={video.id} name={video.name} />
													))}
												</AccordionContent>
											</AccordionPrimitive.Item>
										</AccordionPrimitive.Root>
									</div>
								))}
							</AccordionContent>
						</AccordionPrimitive.Item>
					</AccordionPrimitive.Root>
				</a>
			</li>
		</ul>
	)
}

interface LeafProps {
	name: string
}

function Leaf({ name }: LeafProps) {
	return (
		<a href="#" className="flex flex-1 items-center py-4 font-medium">
			<ChevronRight className="h-4 w-4 shrink-0 opacity-0" />
			<Folder className="h-6 w-6 shrink-0 mr-5" aria-hidden="true" />
			{name}
		</a>
	)
}

interface AccordionTriggerProps
	extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
	children: React.ReactNode
}

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	AccordionTriggerProps
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

interface AccordionContentProps
	extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {
	children: React.ReactNode
}

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	AccordionContentProps
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
