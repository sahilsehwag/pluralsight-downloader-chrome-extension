import React from 'react'

import { Button } from '~/components/ui/button'
import { useStorage } from '~/hooks/useStorage'
import { MESSAGES } from '~/constants/actions'
import { sendAction } from '~/utils/chrome'
import { addCourseToQueue } from '~/modules/download'
import { startDownload } from '~/modules/queue'
import { Course as CourseType } from '~/entities/Course'

interface CourseData {
	id: string
	name: string
	children?: CourseData[]
}

const data: CourseData[] = [
	{ id: '1', name: 'Unread' },
	{ id: '2', name: 'Threads' },
	{
		id: '3',
		name: 'Chat Rooms',
		children: [
			{ id: 'c1', name: 'General' },
			{ id: 'c2', name: 'Random' },
			{ id: 'c3', name: 'Open Source Projects' },
		],
	},
	{
		id: '4',
		name: 'Direct Messages',
		children: [
			{
				id: 'd1',
				name: 'Alice',
				children: [
					{ id: 'd1', name: 'Alice2' },
					{ id: 'd2', name: 'Bob2' },
					{ id: 'd3', name: 'Charlie2' },
				],
			},
			{ id: 'd2', name: 'Bob' },
			{ id: 'd3', name: 'Charlie' },
		],
	},
]

export const Dashboard = () => {
	const [course] = useStorage<'course', CourseType>({ key: 'course' })

	return (
		<div className="h-full flex items-center justify-center gap-2">
			{!course ? (
				<Button onClick={sendAction(MESSAGES.PARSE_COURSE)}>Load course</Button>
			) : (
				<Button onClick={addCourseToQueue(course)}>Download course</Button>
			)}
			<Button onClick={startDownload()}>Download next in queue</Button>
		</div>
	)
}
