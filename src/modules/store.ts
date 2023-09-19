import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import { KeyOf } from '~/types'
import { Store } from '~/entities'

// storage
type Get = <K extends KeyOf<Store>>(key: K)                                        => T.Task<Store[K]>
type Set = <K extends KeyOf<Store>>(key: K) => (value: Store[K])                   => T.Task<void>
type Map = <K extends KeyOf<Store>>(key: K) => (fn: (value: Store[K]) => Store[K]) => T.Task<void>

export const get: Get = key => pipe(
  () => chrome.storage.local.get(key),
	T.map(_ => _[key]),
)

export const set: Set =
	key => value =>
		() => chrome.storage.local.set({
			[key]: value,
		})

export const map: Map =
	key => fn => pipe(
		// @ts-ignore
    get(key),
    T.map(fn),
    T.flatMap(set(key)),
	)
