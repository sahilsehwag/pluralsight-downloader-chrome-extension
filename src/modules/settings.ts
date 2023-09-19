import { pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'

import { get } from "~/modules/store";
import { Settings } from '~/entities';
import { KeyOf } from '~/types';

const getSettings = get('settings')

type GetSetting = <K extends KeyOf<Settings>>
  (setting: K) => T.Task<Settings[K]>

export const getSetting: GetSetting = setting =>
  pipe(
    getSettings,
    T.map(_ => _[setting]),
  )

export const getDelay = getSetting('downloadDelay')
