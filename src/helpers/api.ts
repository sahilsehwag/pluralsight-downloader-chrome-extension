import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'

import { fetch } from '~/utils/api'
import { get } from '~/utils/chrome'

import ERRORS from '~/constants/errors'
import {
	VIDEO_QUALITIES,
	COURSE_TYPES,
	FIELD_X_KEY,
	VIDEO_EXTENSIONS,
  RESOURCE_URLS,
} from '~/constants'

const getVideoQuality = () =>
	get(FIELD_X_KEY.COURSE_TYPE).then(courseType =>
		courseType === COURSE_TYPES.NEW ? VIDEO_QUALITIES[0] : VIDEO_QUALITIES[1],
	)

const getVideoURLHeaders = ({
	videoId,
	extension = VIDEO_EXTENSIONS[0],
	quality,
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
		versionId: '',
	}),
})

export const fetchVideoURL = ({
	videoId,
	videoUrlSource = RESOURCE_URLS.VIDEO[0],
}) =>
	pipe(
		getVideoQuality,
		TE.fromTask,
		TE.flatMap(quality =>
			fetch(
				videoUrlSource,
				getVideoURLHeaders({
					videoId,
					quality,
				}),
			),
		),
		TE.flatMapNullable(
			response => response.urls?.[0]?.url,
			() => new Error(ERRORS.parsingVideoUrlFailed),
		),
	)

export const getSubtitleURL = ({
	videoId,
	versionId,
	languageCode = 'en',
	subsUrlSource = RESOURCE_URLS.SUBS[0],
}) =>
	subsUrlSource + '/' + videoId + '/' + versionId + '/' + languageCode + '/'

export const fetchExcerciseFilesURL = ({ courseId }) =>
	pipe(
		fetch(
			`https://app.pluralsight.com/learner/user/courses/${courseId}/exercise-files-url`,
		),
		TE.flatMapNullable(
			response => response.excerciseFilesUrl,
			() => new Error(ERRORS.parsingExcerciseFilesUrlFailed),
		),
	)
