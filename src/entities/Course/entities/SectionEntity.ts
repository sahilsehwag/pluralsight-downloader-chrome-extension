import { get, findBy } from 'shades'

import { idL, nameL, statusL, videosL } from '~/entities/Course/lenses'

export const SectionEntity = {
  getId: get(idL),
  getName: get(nameL),
  getVideos: get(videosL),
  getStatus: get(statusL),

  getVideo: idx => get(videosL, idx),
}
