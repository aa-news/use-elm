export function logReducer<S, A>(
    reducer: (state: S, action: A) => S
): (state: S, action: A) => S {
    return (state, action) => {
        console.log('State: ')
        console.log(state)

        console.log('Action: ')
        console.log(action)

        const newState = reducer(state, action)

        console.log('New state: ')
        console.log(newState)
        console.log()

        return newState
    }
}
