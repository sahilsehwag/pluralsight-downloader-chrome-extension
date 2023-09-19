import { get } from 'shades'

import { idL, nameL, statusL, versionIdL } from '~/entities/Course/lenses'

export const VideoEntity = {
  getId: get(idL),
  getName: get(nameL),
  getVersionId: get(versionIdL),
  getStatus: get(statusL),
}

