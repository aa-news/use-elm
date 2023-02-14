import { useEffect, useReducer } from 'react';
export const cmdNone = {
    cmdName: 'none',
    execute() { }
};
export default function useElm(initialPair, update, subscriptions, enableLogging) {
    const [internal, sendMessage] = useReducer((model, message) => {
        const [newModel, command] = update(model, message);
        if (enableLogging === true) {
            console.group();
            console.log(model);
            console.log('+');
            console.log(message);
            console.log('---->');
            console.log(newModel);
            console.log(',');
            console.log(command);
            console.groupEnd();
        }
        return toInternal([newModel, command]);
    }, toInternal(initialPair));
    useEffect(() => {
        internal[kCommand].execute(sendMessage);
    }, [internal[kCommand]]);
    useEffect(() => {
        const allCleanupFns = [];
        for (const sub of subscriptions) {
            const cleanupFn = sub.setup(sendMessage);
            allCleanupFns.push(cleanupFn);
        }
        return () => {
            for (const cleanupFn of allCleanupFns) {
                cleanupFn();
            }
        };
    }, []);
    return [internal, sendMessage];
}
const kCommand = Symbol('kCommand');
function toInternal(pair) {
    const [model, command] = pair;
    return {
        ...model,
        [kCommand]: command
    };
}
//# sourceMappingURL=main.js.map