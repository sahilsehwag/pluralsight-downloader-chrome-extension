import { flow } from 'fp-ts/function'
import * as A from 'fp-ts/Array'

import { Log } from "~/entities/Store";
import { map } from '~/modules/store';

export const buildLog = ({ message, type = 'INFO' }): Log => ({
  message,
  type: type as Log['type'],
  date: (new Date()).toISOString(),
})

export const clearLogs =               map('logs')(() => [])
export const addLog    = (log: Log) => map('logs')(A.prepend(log))

export const buildErrorLog   = ({ message }: Error) => buildLog({ message, type : 'ERROR' })
export const buildInfoLog    = (message: string)    => buildLog({ message, type : 'INFO' })
export const buildWarnLog    = (message: string)    => buildLog({ message, type : 'WARN' })
export const buildSuccessLog = (message: string)    => buildLog({ message, type : 'SUCCESS' })
export const buildDebugLog   = (message: string)    => buildLog({ message, type : 'DEBUG' })

export const log        = flow(buildLog,        addLog)
export const logError   = flow(buildErrorLog,   addLog)
export const logInfo    = flow(buildInfoLog,    addLog)
export const logWarn    = flow(buildWarnLog,    addLog)
export const logDebug   = flow(buildDebugLog,   addLog)
export const logSuccess = flow(buildSuccessLog, addLog)
