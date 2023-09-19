export const EXTENSIONS = {
  VIDEO: ['mp4'],
  SUBTITLE: ['vtt'],
}

export const QUALITIES = {
	VIDEO: ['1280x720', '1024x768'],
}

// source to actually get the resource URL
export const SOURCES = {
	VIDEO: ['https://app.pluralsight.com/video/clips/v3/viewclip'],
	SUBTITLE: ['https://app.pluralsight.com/transcript/api/v1/caption/webvtt'],
}
