import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { S } from '@mobily/ts-belt'

import {
	CourseEntity as CE,
	Course,
	SectionEntity as SE,
	VideoEntity as VE,
	Video,
} from '~/entities/Course'

import { ROOT_DIRECTORY } from '~/constants'
import { removeInvalidCharacters } from '~/utils'

const DELIMITERS = { DOT: '.' }

// TODO:
export const getZerosToPad = ({ idx }) => (1 + idx <= 9 ? 1 : 0)

const buildSectionFilename = ({
	sectionIdx,
	sectionName,
	zerosToPad = 1,
	delimiter = DELIMITERS.DOT,
}) =>
	pipe(
		`${sectionIdx + 1}`,
		idx => (1 + sectionIdx <= 9 ? idx.padStart(zerosToPad, '0') : idx),
		idx => `${idx}${delimiter} ${sectionName}`,
		removeInvalidCharacters,
	)

const buildVideoFilename = ({
	videoIdx,
	videoTitle,
	zerosToPad = 0,
	extension = 'mp4',
	delimiter = DELIMITERS.DOT,
}) =>
	pipe(
		`${videoIdx + 1}`,
		idx => (1 + videoIdx <= 9 ? idx.padStart(zerosToPad, '0') : idx),
		idx => `${idx}${delimiter} ${videoTitle}.${extension}`,
		removeInvalidCharacters,
	)

const buildSubtitleFilename = args =>
	buildVideoFilename({
		...args,
		extension: 'vtt',
	})

const buildCourseFilename = ({ courseTitle, authors }) =>
	pipe(
		authors,
		O.fromPredicate(S.isNotEmpty),
		O.match(
			() => courseTitle,
			authors => `${courseTitle} By ${authors}`,
		),
		removeInvalidCharacters,
	)

const buildPlaylistFilename = () => 'playlist.m3u8'

const buildExcercisesFilename = () => 'excercise.zip'

export const buildCoursePath = ({ course }) =>
	pipe(
		buildCourseFilename({
			courseTitle: CE.getTitle(course),
			authors: CE.getAuthorsStr(course),
		}),
		S.prepend(`${ROOT_DIRECTORY}\\`),
	)

export const buildSectionPath = ({
	course,
	sectionIdx,
}: {
	course: Course
	sectionIdx: number
}) =>
	pipe(
		buildCoursePath({ course }),
		S.append('\\'),
		S.append(
			buildSectionFilename({
				sectionIdx,
				sectionName: pipe(course, CE.getSection(sectionIdx), SE.getTitle),
			}),
		),
	)

export const buildVideoPath = ({
	course,
	sectionIdx,
	videoIdx,
	video = pipe(course, CE.getSection(sectionIdx), SE.getVideo(videoIdx)),
}: {
	course: Course
	sectionIdx: number
	videoIdx: number
	video?: Video
}) =>
	pipe(
		buildSectionPath({ course, sectionIdx }),
		S.append('\\'),
		S.append(
			buildVideoFilename({
				videoIdx,
				videoTitle: VE.getTitle(video),
			}),
		),
	)

export const buildSubtitlePath = ({
	course,
	sectionIdx,
	videoIdx,
}: {
	course: Course
	sectionIdx: number
	videoIdx: number
}) =>
	pipe(
		buildSectionPath({ course, sectionIdx }),
		S.append('\\'),
		S.append(
			buildSubtitleFilename({
				videoIdx,
				videoName: pipe(
					course,
					CE.getSection(sectionIdx),
					SE.getVideo(videoIdx),
					VE.getTitle,
				),
			}),
		),
	)

export const buildPlaylistFilePath = ({ course }): string =>
	pipe(
		buildCoursePath({ course }),
		S.append('\\'),
		S.append(buildPlaylistFilename()),
	)

export const buildExercisesPath = ({ course }): string =>
	pipe(
		buildCoursePath({ course }),
		S.append('\\'),
		S.append(buildExcercisesFilename()),
	)
