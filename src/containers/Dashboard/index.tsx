import React from 'react'

import { Button } from '~/components/ui/button'
import { useStorage } from '~/hooks/useStorage'
import { MESSAGES } from '~/constants/actions'
import { sendAction } from '~/utils/chrome'
import { addCourseToQueue } from '~/modules/download'
import { startDownload } from '~/modules/queue'
import { Course as CourseType } from '~/entities/Course'
import { Course } from '~/components/Course'

interface CourseData {
	id: string
	name: string
	children?: CourseData[]
}

export const sampleCourseTreeData: CourseType = {
	id: '1',
	name: 'Sample Course',
	authors: ['John Doe', 'Jane Doe'],
	sections: [
		{
			id: '1',
			name: 'Section 1',
			videos: [
				{
					id: '1',
					name: 'Video 1',
					versionId: '1',
					status: 'PENDING',
				},
				{
					id: '2',
					name: 'Video 2',
					versionId: '1',
					status: 'PENDING',
				},
			],
			status: 'PENDING',
		},
		{
			id: '2',
			name: 'Section 2',
			videos: [
				{
					id: '3',
					name: 'Video 3',
					versionId: '1',
					status: 'PENDING',
				},
			],
			status: 'PENDING',
		},
	],
	status: 'PENDING',
}

export const Dashboard = () => {
	const [course] = useStorage<'course', CourseType>({ key: 'course' })

	return (
		<div className="h-full flex items-center justify-center gap-2">
			{!course ? (
				<Button variant="secondary" onClick={sendAction(MESSAGES.PARSE_COURSE)}>
					Load course
				</Button>
			) : (
				<Button onClick={addCourseToQueue(course)}>Download course</Button>
			)}
			<Button onClick={startDownload()}>Download next in queue</Button>
			{/* <Course course={sampleCourseTreeData} /> */}
		</div>
	)
}
