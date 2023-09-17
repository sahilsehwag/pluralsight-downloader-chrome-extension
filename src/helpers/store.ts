import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as T from 'fp-ts/Task'
import { D } from '@mobily/ts-belt'

import { get, set } from '~/utils'

import { FIELD_X_KEY } from '~/constants/store'
import { DownloadItem } from '~/types'

export const getStore = () =>
	pipe(FIELD_X_KEY, D.values, chrome.storage.sync.get)

const mapQueue = fn =>
	pipe(
		() => get('queue'),
		T.map(fn),
		T.flatMap(queue =>
			() => set('queue', queue)
		),
	)

export const addDownloadItemsToQueue = (items: DownloadItem[]) =>
	mapQueue(A.concat(items))

export const removeDownloadItem = (item: DownloadItem) =>
	mapQueue(
		A.filter<DownloadItem>(
			other => other.videoId !== item.videoId
		)
	)

export const updateDownloadItem = (item: DownloadItem) =>
  mapQueue(
		A.map<DownloadItem, DownloadItem>(
			other => other.videoId === item.videoId ? item : other
		)
	)

export const getNextQueuedDownloadItem = () => pipe(
  () => get('queue'),
  T.map(
		A.findFirst<DownloadItem>(
			other => other.status === 'QUEUED'
		)
	),
)

export const removeCompletedDownloadItems = () =>
	mapQueue(
		A.filter<DownloadItem>(other => other.status !== 'COMPLETED')
	)
