import { Dispatch, useEffect } from 'react'

export interface Cmd<Action> {
    cmdName?: string,
    initialAction?: Action

    /**
     * Must never throw -- should always return some action, even if the
     * command has failed
     */
    execute(): Promise<Action>
}

export function useCmds<Action>(
    dispatch: Dispatch<Action>,
    commands: Cmd<Action>[]
) {
    // Alphabet: { unmount, dispatch, cmd, cmd-init, done }
    //
    // P(0) = unmount -> STOP | cmd -> P(1) | cmd-init -> dispatch -> P(1)

    // P(n + 1) = (unmount -> U(n + 1) 
    //            | cmd -> P(n + 2) 
    //            | cmd-init -> dispatch -> P(n + 2)
    //            | done -> dispatch -> P(n))
    //
    //
    // U(0) = STOP
    // U(n + 1) = done -> U(n)

    let unmounted = false

    useEffect(() => {
        if (unmounted) {
            return
        }

        for (const cmd of commands) {
            if (cmd.initialAction) {
                dispatch(cmd.initialAction)
            }

            cmd.execute().then(action => {
                if (unmounted) {
                    return
                }

                dispatch(action)
            })
        }
    }, [commands])

    useEffect(() => {
        return () => {
            unmounted = true
        }
    }, [])
}
