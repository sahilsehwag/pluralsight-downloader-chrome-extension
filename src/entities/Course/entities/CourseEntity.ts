import { flow } from 'fp-ts/function'
import { get, set, all } from 'shades'

import {
	authorsL,
	idL,
	titleL,
	sectionsL,
	statusL,
	videosL,
} from '~/entities/Course/lenses'

export const CourseEntity = {
	getId: get(idL),
	getTitle: get(titleL),
	getAuthors: get(authorsL),
	getSections: get(sectionsL),
	getStatus: get(statusL),
	getSection: idx => get(sectionsL, idx),

	setStatus: set(statusL),

	setSectionStatus: sectionIdx => set(sectionsL, sectionIdx, statusL),
	setVideoStatus: (sectionIdx, videoIdx) =>
		set(sectionsL, sectionIdx, videosL, videoIdx, statusL),

	getStatusesInCourse: get(sectionsL, all(), statusL),
	getStatusesInSection: sectionIdx =>
		get(sectionsL, sectionIdx, videosL, all(), statusL),

	// utilities/helpers
	getAuthorsStr: flow(get(authorsL), as => as.join(', ')),
}
