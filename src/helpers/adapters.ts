import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'

import { Course, Video, Author, Section } from 'entities'

const isVideo = item => item.type === 'clip'

const adaptAuthor = ({ displayName, authorHandle }): Author =>
	displayName ?? authorHandle

const adaptVideo = (idx, {
	id,
	title,
	version,
}): Video => ({
	id,
	name: title,
  version,
})

const adaptSection = (idx, {
	id,
	title,
	contentItems,
}): Section => ({
	id,
	name: title,
	videos: pipe(
		contentItems,
		A.filter(isVideo),
		A.mapWithIndex(adaptVideo),
	),
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
		A.mapWithIndex(adaptSection)
	),
})
