import { flow } from 'fp-ts/function'
import { get, all, findBy } from 'shades'

export type Author = string

export type Section = {
  id: string;
  name: string;
  videos: Video[]
}

export type Video = {
  id: string;
  name: string;
  version: string;
}

export type Course = {
  id: string;
  name: string;
  authors: Author[];
  sections: Section[];
}

export const idL = 'id'
export const nameL = 'name'
export const authorsL = 'authors'
export const sectionsL = 'sections'
export const videosL = 'videos'
export const versionL = 'version'

export const VideoEntity = {
  getId: get(idL),
  getName: get(nameL),
  getVersion: get(versionL),
}

export const SectionEntity = {
  getId: get(idL),
  getName: get(nameL),
  getVideos: get(videosL),
  getVideo: idx => get(videosL, idx),

  // utilities/helpers
  findVideo: id => get(
    videosL,
    findBy({ id })
  ),
}

export const CourseEntity = {
  getId: get(idL),
  getName: get(nameL),
  getAuthors: get(authorsL),
  getSections: get(sectionsL),
  getSection: idx => get(sectionsL, idx),

  // utilities/helpers
  findVideo: id => get(
    sectionsL,
    all(),
    videosL,
    findBy({ id })
  ),
  findSectionByVideoId: id => get(
    sectionsL,
    findBy<Section>(
      SectionEntity.findVideo(id),
    ),
  ),

  // utilities/helpers
  getAuthorsStr: flow(
    get(authorsL),
    as => as.join(', '),
  ),
}

