import { DownloadStatus } from '~/entities/Store'

export type Author = string

export type Video = {
	id: string
	name: string
	versionId: string
	status: DownloadStatus
}

export type Section = {
	id: string
	name: string
	// TODO: instead of array use map
	videos: Video[]
	status: DownloadStatus
}

export type Course = {
	id: string
	name: string
	authors: Author[]
	// TODO: instead of array use map
	sections: Section[]
	status: DownloadStatus
}
