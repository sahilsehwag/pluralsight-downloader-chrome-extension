export * from './store'
export * from './labels'
export * from './urls'
export * from './locales'
export * from './configs'
export * from './messages'
export * from './errors'

export const APP_NAME = 'Pluralsight Downloader'
export const ROOT_DIRECTORY = 'Pluralsight'

export const DELIMITERS = { DOT: '.' }
export const INVALID_CHARACTERS = /[/*?<>|']/g

export const VIDEO_EXTENSIONS = ['mp4']
export const SUBTITLE_EXTENSIONS = ['vtt']
export const VIDEO_QUALITIES = ['1280x720', '1024x768']

export const DOWNLOAD_TIMEOUT = 3000
