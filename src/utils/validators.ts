import { pipe, apply } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import * as A from 'fp-ts/Array'

export type Validator<E, T> = (value: T) => E.Either<E, T>

type Validate = <E, T>
	(validators: Validator<E, T>[]) =>
	(value: T) =>
	E.Either<E[], T>

export const validate: Validate = validators => value =>
	pipe(
		validators,
		A.map(apply(value)),
		A.lefts,
		E.fromPredicate(A.isNonEmpty, () => value),
		E.swap,
	)
