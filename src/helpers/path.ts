import { pipe, flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { S } from '@mobily/ts-belt'

import {
	CourseEntity as CE,
	Course,
	SectionEntity as SE,
	VideoEntity as VE,
    Video,
} from 'entities'

import { DELIMITERS, ROOT_DIRECTORY, SUBTITLE_EXTENSIONS, VIDEO_EXTENSIONS } from 'constants/index'
import { removeInvalidCharacters } from 'utils'

// TODO:
export const getZerosToPad = ({ idx, size }) => 1+idx <= 9 ? 1 : 0

const buildSectionFilename = ({
	sectionIdx,
	sectionName,
	zerosToPad = 1,
	delimiter = DELIMITERS.DOT,
}) =>
	pipe(
		`${sectionIdx + 1}`,
		idx => 1 + sectionIdx <= 9 ? idx.padStart(1, '0') : idx,
		idx => `${idx}${delimiter} ${sectionName}`,
		removeInvalidCharacters,
	)

const buildVideoFilename = ({
	videoIdx,
	videoName,
	zerosToPad = 0,
	delimiter = DELIMITERS.DOT,
	extension = VIDEO_EXTENSIONS[0],
}) =>
	pipe(
		`${videoIdx + 1}`,
		idx => 1 + videoIdx <= 9 ? idx.padStart(1, '0') : idx,
		idx => `${idx}${delimiter} ${videoName}.${extension}`,
		removeInvalidCharacters,
	)

const buildSubtitleFilename = (args) => buildVideoFilename({
	...args,
	extension: SUBTITLE_EXTENSIONS[0],
})

const buildCourseFilename = ({ courseName, authors }) =>
	pipe(
		authors,
		O.fromPredicate(S.isNotEmpty),
		O.match(
			() => courseName,
			authors => `${courseName} By ${authors}`,
		),
		removeInvalidCharacters,
	)

const buildPlaylistFilename = () => 'playlist.m3u8'

const buildExcercisesFilename = () => 'excercise.zip'

export const buildCoursePath = ({ course }) => pipe(
	buildCourseFilename({
		courseName: CE.getName(course),
		authors: CE.getAuthorsStr(course),
	}),
	S.prepend(`${ROOT_DIRECTORY}\\`),
)

export const buildSectionPath = ({
	course,
	sectionIdx,
}: {
	course: Course,
	sectionIdx: number;
}) =>
	pipe(
    buildCoursePath({ course }),
		S.append('\\'),
		S.append(
			buildSectionFilename({
				sectionIdx,
        sectionName: pipe(
          course,
					CE.getSection(sectionIdx),
          SE.getId,
				)
			}),
		),
	)

export const buildVideoPath = ({
	course,
	sectionIdx,
	videoIdx,
	video = pipe(
		course,
		CE.getSection(sectionIdx),
		SE.getVideo(videoIdx),
	),
}: {
	course: Course,
	sectionIdx: number;
	videoIdx: number;
	video?: Video;
}) =>
	pipe(
    buildSectionPath({ course, sectionIdx }),
		S.append('\\'),
		S.append(
			buildVideoFilename({
				videoIdx,
        videoName: VE.getName(video),
			}),
		),
	)

export const buildSubtitlePath = ({
	course,
	sectionIdx,
	videoIdx,
}: {
	course: Course,
	sectionIdx: number;
	videoIdx: number;
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
					VE.getName,
        )
			}),
		),
	)

export const buildPlaylistFilePath = ({ course }): string =>
	pipe(
    buildCoursePath({ course }),
    S.append('\\'),
    S.append(
			buildPlaylistFilename(),
		),
	)

export const buildExercisesPath = ({ course }): string =>
	pipe(
    buildCoursePath({ course }),
    S.append('\\'),
    S.append(
			buildExcercisesFilename(),
		),
	)
