import L from 'react-on-lambda'

import { Log } from '~/entities/Store'
import { clearLogs } from '~/modules/logging'
import { useStorage } from '~/hooks/useStorage'

import { Button } from '~/components/ui/button'
import { EmptyPage } from '~/components/EmtpyPage'
import { mutedText, primaryText } from '~/components/helpers'
import { EraserIcon, FlagIcon, InfoIcon, PartyPopperIcon } from 'lucide-react'

// TODO:
const ACTIONS = [
  { tooltip: 'Info',         onClick: () => {}, icon: <InfoIcon /> },
  { tooltip: 'Report issue', onClick: () => {}, icon: <FlagIcon /> },
]

const action = ({ icon, tooltip, onClick }) =>
  Button({
    tooltip,
    onClick,
    key: tooltip,
    variant: 'icon',
    size: 'iconSmall',
    className: 'invisible group-hover:visible hover:text-primary',
  })(
    icon
  )

const log = ({ type, message }) => L.div({
  className: 'group border-b border-muted p-2 flex gap-2 justify-between',
})(
  L.span(
    primaryText(`[${type}] `),
    message,
  ),
  L.div({ className: 'flex gap-2' })(
    L.mapKey(action, ACTIONS),
  )
)

const clearLogsBtn = L.nest(
  L.div({ className: 'absolute right-5 bottom-5' }),
  Button({
    tooltip: 'Clear logs',
    onClick: clearLogs,
    size: 'icon',
    variant: 'outline',
  }),
  <EraserIcon />,
)

export const Logs = L(() => {
  const [logs] = useStorage({
    key: 'logs',
    initial: [],
  })

  return !logs || !logs.length
    ? EmptyPage(
      mutedText('Nothing to see here'),
      <PartyPopperIcon className='h-6 w-6 text-primary pl-2' />,
    )
    : L.fragment(
      clearLogsBtn,
      L.mapKey(log, logs),
    )
})
