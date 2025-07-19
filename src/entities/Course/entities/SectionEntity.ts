import { get } from 'shades'

import { idL, titleL, statusL, videosL } from '~/entities/Course/lenses'

export const SectionEntity = {
	getId: get(idL),
	getTitle: get(titleL),
	getVideos: get(videosL),
	getStatus: get(statusL),

	getVideo: idx => get(videosL, idx),
}
