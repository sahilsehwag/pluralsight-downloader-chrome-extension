import { DownloadStatus } from '~/entities/Store'

export type Author = string

export type Video = {
	id: string
	title: string
	versionId: string
	status: DownloadStatus
}

export type Section = {
	id: string
	title: string
	// TODO: instead of array use map
	videos: Video[]
	status: DownloadStatus
}

export type Course = {
	id: string
	title: string
	authors: Author[]
	// TODO: instead of array use map
	sections: Section[]
	status: DownloadStatus
}
