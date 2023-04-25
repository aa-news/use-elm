export interface Deferred {
    promise: Promise<void>,
    resolve(): void,
    reject(reason?: any): void
}

export function createDeffered(): Deferred {
    let resolve: Deferred['resolve']
    let reject: Deferred['reject']

    const promise = new Promise<void>((res, rej) => {
        resolve = res
        reject = rej
    })

    return {
        promise,
        resolve: resolve!,
        reject: reject!
    }
}
