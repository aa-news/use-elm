import { Cmd } from './Cmd'
import { createDeffered } from './deferred'
import { Timeout } from './time-types'

export function cmdTimeout<Action>(
  ms: number,
  onStart: (id: Timeout) => Action,
  onTimeout: (id: Timeout) => Action
): Cmd<Action> {
  const deferred = createDeffered()

  const id = setTimeout(() => {
    deferred.resolve()
  }, ms)

  return {
    cmdName: `timeout ${ms}ms`,

    initialAction: onStart(id),

    async execute() {
      await deferred.promise
      return onTimeout(id)
    }
  }
}
