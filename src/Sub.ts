import { Dispatch, useState, useEffect, useRef } from 'react'

export interface Sub<Action> {
    /**
     * This property is populated by internal code, leave it unset
     */
    id?: number

    subName?: string
    setup(dispatch: Dispatch<Action>): () => void
}

export const noneSub: Sub<any> = {
    subName: 'none',

    setup(_dispatch) {
        return () => { }
    },
}
let id = 0

export function useSubs<Action>(dispatch: Dispatch<Action>, subs: Sub<Action>[]) {
  const previousSubs = useRef<Sub<Action>[]>([])
  const cleanups = useRef(new Map<Sub<Action>, () => void>())

  useEffect(() => {
    const newSubs = difference(subs, previousSubs.current)
    const removedSubs = difference(previousSubs.current, subs)

    for (const s of newSubs) {
      s.id = id
      ++id

      const cleanupFn = s.setup(dispatch)
      cleanups.current.set(s, cleanupFn)
    }

    for (const s of removedSubs) {
      const fn = cleanups.current.get(s)!
      cleanups.current.delete(s)

      fn()
    }

    previousSubs.current = subs
  }, [dispatch, subs])
}

/**
 * Returns elements of `a` that are not in `b`
 */
function difference<T>(a: T[], b: T[]): T[] {
    return a.filter((v) => !b.includes(v))
}
