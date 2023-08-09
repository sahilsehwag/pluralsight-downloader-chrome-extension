import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'

import ERRORS from 'constants/errors'

import { adaptCourse } from './adapters'

export const getCourse = () => pipe(
  (window as any).__NEXT_DATA__?.props?.pageProps?.tableOfContents,
  E.fromOption(
    () => new Error(ERRORS.noCourseJson)
  ),
  E.map(adaptCourse),
)

export const getVideoId = () => pipe(
  (window as any).__NEXT_DATA__?.query?.clipId as string,
  E.fromNullable(
    () => new Error(ERRORS.noVideoId)
  )
)
