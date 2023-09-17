import {
	STATUSES,
	LOCALE_X_LANGUAGE,
} from '~/constants/index'

import { Course } from './Course'
import { DownloadItem, KeyOf, ValueOf } from '~/types'

export type Store = {
  // state
  status: ValueOf<typeof STATUSES>;
  courses: Course[];
	queue: DownloadItem[];

  // settings
  downloadDelay: number,
  primaryLocale: KeyOf<typeof LOCALE_X_LANGUAGE>,
	secondaryLocale: KeyOf<typeof LOCALE_X_LANGUAGE>,
}
