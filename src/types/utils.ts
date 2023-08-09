export type Nullable<T> = T | null | undefined
export type KeyOf<T> = keyof T
export type ValueOf<T> = T[keyof T]

export type Fn1<A, R> = (a: A) => R
export type Fn2<A, B, R> = (a: A, b: B) => R
export type Fn3<A, B, C, R> = (a: A, b: B, c: C) => R
