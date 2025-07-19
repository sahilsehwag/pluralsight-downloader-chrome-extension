import React from 'react'
import {
	ChevronRight,
	Folder,
	FileVideo,
	ArrowDownToLine,
	TrashIcon,
} from 'lucide-react'
import { Course } from '~/entities/Course'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface TreeProps {
	data: Course
	idx?: number
}

// custom component (not from shadcn)
export const Tree = ({ data, idx }: TreeProps) => {
	return (
		<ul role="list" className="space-y-1">
			<li key={data.id}>
				<a href="#">
					<AccordionPrimitive.Root type="single" collapsible>
						<AccordionPrimitive.Item value={data.id}>
							<AccordionTrigger>{data.title}</AccordionTrigger>
							<AccordionContent className="pl-4">
								{data.sections.map((section, idx) => (
									<div key={section.id}>
										<AccordionPrimitive.Root type="single" collapsible>
											<AccordionPrimitive.Item value={section.id}>
												<AccordionTrigger>
													{idx + 1}. {section.title}
												</AccordionTrigger>
												<AccordionContent className="pl-4">
													{section.videos.map((video, idx) => (
														<Leaf
															key={video.id}
															title={video.title}
															idx={idx}
														/>
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
	title: string
	idx: number
}

function Leaf({ title, idx }: LeafProps) {
	return (
		<a
			href="#"
			className="flex items-center py-2 font-medium border-b hover:text-[hsl(var(--primary))] w-full group"
		>
			<FileVideo className="h-4 w-4 shrink-0 mr-2" aria-hidden="true" />
			<span className="truncate w-0 flex-1">
				{idx + 1}. {title}
			</span>
			<div className="flex flex-1 items-center justify-end hidden group-hover:flex">
				<Button variant="icon" size="iconSmall">
					<ArrowDownToLine className="h-4 w-4 shrink-0 cursor-pointer" />
				</Button>
				<Button variant="icon" size="iconSmall">
					<TrashIcon className="h-4 w-4 shrink-0 cursor-pointer" />
				</Button>
			</div>
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
		<div className="flex items-center border-b cursor-pointer py-2 font-medium w-full group">
			<AccordionPrimitive.Trigger
				ref={ref}
				className={cn(
					'flex items-center transition-all first:[&[data-state=open]_.chevron]:rotate-90 hover:text-[hsl(var(--primary))]',
					className,
				)}
				{...props}
			>
				<ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 chevron" />
				<Folder className="h-4 w-4 shrink-0 mr-2" aria-hidden="true" />
				<span className="truncate flex-1">{children}</span>
			</AccordionPrimitive.Trigger>
			<div className="flex flex-1 items-center justify-end hidden group-hover:flex">
				<Button variant="icon" size="iconSmall">
					<ArrowDownToLine className="h-4 w-4 shrink-0 cursor-pointer" />
				</Button>
				<Button variant="icon" size="iconSmall">
					<TrashIcon className="h-4 w-4 shrink-0 cursor-pointer" />
				</Button>
			</div>
		</div>
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
		<div className="pb-2 pt-0">{children}</div>
	</AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName
