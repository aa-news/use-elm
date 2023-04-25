import { Sub } from './Sub'

export function subInterval<Action>(action: Action, ms: number): Sub<Action> {
  return {
    subName: `interval ${ms}ms`,

    setup(dispatch) {
      const id = setInterval(() => dispatch(action), ms)
      return () => clearInterval(id)
    },
  }
}
