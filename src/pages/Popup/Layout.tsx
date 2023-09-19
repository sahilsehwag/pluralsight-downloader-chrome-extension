import L from 'react-on-lambda'
import { pipe } from 'fp-ts/function'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui/tabs'

import { TABS } from './constants'

const wrapper = L.div({
  // FIX: overflow problem
  className: 'bg-background text-foreground dark h-[600px] overflow-hidden p-5 pb-16',
})

const tabs = Tabs({
  defaultValue: TABS.DASHBOARD.value,
  className: 'h-full',
})

const triggers = pipe(
  Object.values(TABS),
  L.mapProps({ key: 'value', value: 'value', children: 'label' }),
  L.mapKey(TabsTrigger),
  TabsList,
)

const content = pipe(
  Object.values(TABS),
  L.mapProps({ key: 'value', value: 'value', children: 'element' }),
  L.mapKey(TabsContent),
)

export const Layout = () => wrapper(
  tabs(
    triggers,
    content,
  ),
)
