import { get } from 'shades'

import { idL, titleL, statusL, versionIdL } from '~/entities/Course/lenses'

export const VideoEntity = {
	getId: get(idL),
	getTitle: get(titleL),
	getVersionId: get(versionIdL),
	getStatus: get(statusL),
}
