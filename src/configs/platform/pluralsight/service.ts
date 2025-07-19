import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import * as Json from 'fp-ts/Json'
import * as Console from 'fp-ts/Console'

import { fetch } from '~/utils/api'

import ERRORS from './errors'
import { QUALITIES, EXTENSIONS, SOURCES } from './constants'

import { adaptCourse } from './adapters'
import { get } from 'shades'

export const getCourse = () =>
	pipe(
		TE.fromEither(getVideoId()),
		TE.chain(id =>
			fetch(
				`https://app.pluralsight.com/course-player/api/v1/table-of-contents/clip/${id}`,
			),
		),
		TE.tapIO(Console.log),
		TE.map(adaptCourse),
		TE.tapIO(Console.log),
	)

export const getVideoId = () =>
	pipe(
		window.location.pathname.split('/').at(-1),
		E.fromNullable(new Error(ERRORS.noVideoId)),
	)

// TODO:
const getVideoQuality = () => QUALITIES.VIDEO[0]
//get(FIELD_X_KEY.COURSE_TYPE).then(courseType =>
//  courseType === COURSE_TYPES.NEW ? QUALITIES.VIDEO[0] : QUALITIES.VIDEO[1],
//)

const getVideoURLHeaders = ({
	videoId,
	versionId,
	quality,
	extension = EXTENSIONS.VIDEO[0],
}) => ({
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'x-team': 'video-services',
	},
	body: JSON.stringify({
		clipId: videoId,
		mediaType: extension,
		quality,
		online: true,
		boundedContext: 'course',
		versionId,
	}),
})

export const fetchVideoURL = ({
	videoId,
	versionId,
	videoUrlSource = SOURCES.VIDEO[0],
}) =>
	pipe(
		getVideoQuality(),
		TE.of,
		TE.flatMap(quality =>
			fetch(
				videoUrlSource,
				getVideoURLHeaders({
					videoId,
					quality,
					versionId,
				}),
			),
		),
		TE.flatMapNullable(
			({ urls }) => urls?.[0]?.url,
			() => new Error(ERRORS.parsingVideoUrlFailed),
		),
	)

export const getSubtitleURL = ({
	videoId,
	versionId,
	languageCode = 'en',
	subsUrlSource = SOURCES.SUBTITLE[0],
}) => subsUrlSource + '/' + videoId + '/' + versionId + '/' + languageCode + '/'

export const fetchExcerciseFilesURL = ({ courseId }) =>
	pipe(
		fetch(
			`https://app.pluralsight.com/learner/user/courses/${courseId}/exercise-files-url`,
		),
		TE.flatMapNullable(
			get('excerciseFilesUrl'),
			() => new Error(ERRORS.parsingExcerciseFilesUrlFailed),
		),
	)
