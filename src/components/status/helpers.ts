export const getModuleCompletionStatus = ([modulesCompleted, totalModules]: [
	number,
	number,
]): string => `${modulesCompleted} / ${totalModules}`

export const getVideoCompletionStatus = ([videosCompleted, totalVideos]: [
	number,
	number,
]) => `${videosCompleted} / ${totalVideos}`
