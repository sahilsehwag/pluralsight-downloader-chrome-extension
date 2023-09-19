import * as A from 'fp-ts/Array'

import { Fn1 } from '~/types'

export const allEq = a => A.every(ai => a === ai)
export const anyEq = a => A.some(ai => a === ai)

export const tap = <T>(f: Fn1<T, unknown>) => (v: T) => {
	f(v)
	return v
}

export const noop = (...args: any) => {}
