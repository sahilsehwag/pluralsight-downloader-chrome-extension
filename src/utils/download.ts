import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as T from 'fp-ts/Task'

type SequenceWithDelay = <V>
	(delay: number) =>
	(tasks: T.Task<V>[]) =>
	T.Task<readonly V[]>

export const sequenceWithDelay: SequenceWithDelay = delay => tasks =>
	pipe(
		tasks,
		A.map(T.delay(delay)),
		T.sequenceSeqArray
	)

