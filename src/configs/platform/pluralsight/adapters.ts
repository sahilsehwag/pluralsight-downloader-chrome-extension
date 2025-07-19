import { Course, Video, Author, Section } from '~/entities/Course'

const isVideo = item => item.type === 'clip'

const adaptAuthor = ({ displayName, authorHandle }): Author =>
	displayName ?? authorHandle

const adaptVideo = ({ id, title, version: versionId }): Video => ({
	id,
	title,
	versionId,
	status: 'PENDING',
})

const adaptSection = ({ id, title, contentItems }): Section => ({
	id,
	title,
	videos: contentItems.filter(isVideo).map(adaptVideo),
	status: 'PENDING',
})

export const adaptCourse = ({ id, title, authors, modules }: any): Course => ({
	id,
	title,
	authors: authors.map(adaptAuthor),
	sections: modules.map(adaptSection),
	status: 'PENDING',
})
