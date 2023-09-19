import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'

import { set, map } from "~/modules/store";
import { Store } from '~/entities/Store';
import { KeyOf } from '~/types';

type UseStorageProps<K extends KeyOf<Store>> = {
  key: K;
  initial?: Store[K];
}

export const useStorage = <K extends KeyOf<Store>, V extends Store[K]>
  ({ key, initial }: UseStorageProps<K>) => {
    const [state, setState] = useState<V>();

    useEffect(() => {
      map(key)(
        value => {
          setState((value ?? initial) as any)
          return value ?? initial
        }
      )()
      // eslint-disable-next-line
    }, [key])

    useEffect(() => {
      const handler = delta => pipe(
        delta[key],
        O.fromNullable,
        O.map(v => setState(v.newValue)),
      )

      chrome.storage.onChanged.addListener(handler)

      return () => {
        return chrome.storage.onChanged.removeListener(handler)
      }
    }, [key])

    const updateState = (value: V) => {
      set(key)(value)()
      setState(value)
    }

    return [state, updateState] as [V | undefined, Dispatch<SetStateAction<V>>]
  }
