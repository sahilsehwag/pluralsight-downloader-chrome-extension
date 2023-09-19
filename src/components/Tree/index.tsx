import L from 'react-on-lambda'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '../ui/button'
import { ArrowDownToLine, Delete, DeleteIcon, LucideDelete, PauseIcon } from 'lucide-react'
import { ResumeIcon } from '@radix-ui/react-icons'

export const Tree = L(() => {
	return (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="item-1" className="border-1 pl-2 pr-2">
				<AccordionTrigger>
          <div className="flex justify-between items-center w-full">
            <div className="text-sm no-underline">Is it accessible?</div>
            <div className="flex gap-1">
							<Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:text-primary text-bold">
								<ArrowDownToLine className="h-4 w-4"/>
							</Button>
							<Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:text-primary text-bold">
								<LucideDelete className="h-4 w-4"/>
							</Button>
							<Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:text-primary text-bold">
								<PauseIcon className="h-4 w-4"/>
							</Button>
							<Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:text-primary text-bold">
								<ResumeIcon className="h-4 w-4"/>
							</Button>
						</div>
          </div>
				</AccordionTrigger>
				<AccordionContent>
					{' '}
					Yes. It adheres to the WAI-ARIA design pattern.{' '}
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Is it styled?</AccordionTrigger>
				<AccordionContent>
					Yes. It comes with default styles that matches the other
					components&apos; aesthetic.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-3">
				<AccordionTrigger>Is it animated?</AccordionTrigger>
				<AccordionContent>
					Yes. It&apos;s animated by default, but you can disable it if you
					prefer.
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
})
