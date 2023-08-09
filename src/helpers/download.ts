import { pipe, flow } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as RA from 'fp-ts/ReadonlyArray'
import * as TE from 'fp-ts/TaskEither'

import { buildDownloadItem, downloadFile } from 'utils'

import { addDownloadItemsToQueue } from 'helpers/store'
import { fetchExcerciseFilesURL, fetchVideoURL, getSubtitleURL } from 'helpers/api'
import {
  buildExercisesPath,
  buildPlaylistFilePath,
  buildVideoPath,
  buildSubtitlePath,
} from 'helpers/path'

import {
  CourseEntity as CE,
  SectionEntity as SE,
  VideoEntity as VE,
  Course,
  Section,
} from 'entities'

import { DownloadItem } from 'types'

const getPlaylistFileContent = ({ course }: { course: Course }) => pipe(
  CE.getSections(course),
  A.mapWithIndex((sectionIdx, section: Section) =>
    pipe(
      SE.getVideos(section),
      A.mapWithIndex((videoIdx, video) =>
        buildVideoPath({ course, sectionIdx, videoIdx }),
      ),
    )),
  A.flatten,
  paths => paths.join('\n'),
)

const getDownloadItemsFromVideo = ({ course, sectionIdx, videoIdx, video }) => pipe(
  TE.Do,
  TE.let('videoId',   ()  => VE.getId(video)),
  TE.let('versionId', ()  => VE.getVersion(video)),
  TE.let('sUrl',      (_) => getSubtitleURL(_)),
  TE.bind('vUrl',     (_) => fetchVideoURL(_)),

  TE.map(({ vUrl, sUrl }) => [
    buildDownloadItem({ url: vUrl, course, sectionIdx, videoIdx }),
    buildDownloadItem({ url: sUrl, course, sectionIdx, videoIdx, pathBuilder: buildSubtitlePath }),
  ]),
)

// FIX: right one failed url fetch will cause entire thing not to run
const getDownloadItemsFromSection = ({
  course,
  sectionIdx,
  section = CE.getSection(sectionIdx)(course),
}: {
  course: Course,
  sectionIdx: number,
  section?: Section
}) => pipe(
  SE.getVideos(section),
  A.mapWithIndex((videoIdx, video) =>
    getDownloadItemsFromVideo({ course, sectionIdx, videoIdx, video })),
  TE.sequenceArray,
  TE.map(RA.flatten),
  TE.map(RA.toArray),
)

const getDownloadItemsFromCourse = (course: Course) => pipe(
  CE.getSections(course),
  A.mapWithIndex((sectionIdx, section) =>
    getDownloadItemsFromSection({ course, sectionIdx, section })),
  TE.sequenceArray,
  TE.map(RA.flatten),
  TE.map(RA.toArray),
)

const savePlaylistContentToFile = ({ playlistFileContent, filename }) =>
  pipe(
    new Blob([playlistFileContent], {
      type: 'audio/x-mpegurl',
    }),
    window.URL.createObjectURL,
    url => downloadFile({ url, filename }),
  )

export const downloadPlaylistFile = (course: Course) => pipe(
  TE.Do,
  TE.let('filename',            () => buildPlaylistFilePath({ course })),
  TE.let('playlistFileContent', () => getPlaylistFileContent({ course })),

  TE.flatMapTask(savePlaylistContentToFile),
)

export const downloadExcerciseFiles = (course: Course) => pipe(
  TE.Do,
  TE.let('courseId', ()  => CE.getId(course)),
  TE.let('filename', ()  => buildExercisesPath({ course })),
  TE.bind('url',     (_) => fetchExcerciseFilesURL(_)),

  TE.flatMapTask(downloadFile),
)

export const downloadSection = flow(
  getDownloadItemsFromSection,
  TE.map(addDownloadItemsToQueue),
)

export const downloadCourse = flow(
  getDownloadItemsFromCourse,
  TE.map(addDownloadItemsToQueue),
)

export const downloadRemainingVideos = () => {}

export const cancelVideoDownload = (item: DownloadItem) => {}
export const cancelSectionDownload = (item: DownloadItem) => {}
export const cancelCourseDownload = (item: DownloadItem) => {}

export const pauseVideoDownload = (item: DownloadItem) => {}
export const pauseSectionDownload = (item: DownloadItem) => {}
export const pauseCourseDownload = (item: DownloadItem) => {}

export const resumeVideoDownload = (item: DownloadItem) => {}
export const resumeSectionDownload = (item: DownloadItem) => {}
export const resumeCourseDownload = (item: DownloadItem) => {}
