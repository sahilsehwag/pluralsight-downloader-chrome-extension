import React, { useEffect } from 'react'

import { Button } from '~/components/ui/button'
import { useStorage } from '~/hooks/useStorage'
import { MESSAGES } from '~/constants/actions'
import { sendAction } from '~/utils/chrome'
import { addCourseToQueue } from '~/modules/download'
import { startDownload } from '~/modules/queue'
import { Course as CourseType } from '~/entities/Course'
import { Course } from '~/components/Course'
import { logError, logInfo } from '~/modules/logging'

interface CourseData {
	id: string
	title: string
	children?: CourseData[]
}

export const sampleCourseTreeData: CourseType = {
	id: '1',
	title: 'Sample Course',
	authors: ['John Doe', 'Jane Doe'],
	sections: [
		{
			id: '1',
			title: 'Section 1',
			videos: [
				{
					id: '1',
					title: 'Video 1',
					versionId: '1',
					status: 'PENDING',
				},
				{
					id: '2',
					title: 'Video 2',
					versionId: '1',
					status: 'PENDING',
				},
			],
			status: 'PENDING',
		},
		{
			id: '2',
			title: 'Section 2',
			videos: [
				{
					id: '3',
					title: 'Video 3',
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

	useEffect(() => {
		logInfo('Hello')
	}, [])

	// <Button onClick={addCourseToQueue(course)}>Download course</Button>
	// <Button onClick={startDownload()}>Download next in queue</Button>

	if (!course) {
		return (
			<div className="h-full flex items-center justify-center gap-2">
				<Button variant="secondary" onClick={sendAction(MESSAGES.PARSE_COURSE)}>
					Load course
				</Button>
			</div>
		)
	} else {
		return (
			<div className="h-full overflow-scroll">
				<Course course={course} />
			</div>
		)
	}
}
