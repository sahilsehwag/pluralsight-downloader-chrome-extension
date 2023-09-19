import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'

import { Course, Video, Author, Section } from '~/entities/Course'

const isVideo = item => item.type === 'clip'

const adaptAuthor = ({ displayName, authorHandle }): Author =>
	displayName ?? authorHandle

const adaptVideo = ({
	id,
	title,
	version: versionId,
}): Video => ({
	id,
	name: title,
  versionId,
  status: 'PENDING',
})

const adaptSection = ({
	id,
	title,
	contentItems,
}): Section => ({
	id,
	name: title,
	videos: pipe(
		contentItems,
		A.filter(isVideo),
		A.map(adaptVideo),
	),
	status: 'PENDING',
})

export const adaptCourse = (course: any): Course => ({
	id: course.id,
	name: course.title,
	authors: pipe(
		course.authors,
		A.map(adaptAuthor)
	),
	sections: pipe(
		course.modules,
		A.map(adaptSection)
	),
	status: 'PENDING',
})
