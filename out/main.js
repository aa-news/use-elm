import { useEffect, useReducer } from 'react';
const kCommand = Symbol('kCommand');
export default function useElm(initialState, update, execute, subscribe) {
    const [internal, message] = useReducer((model, message) => {
        return toInternal(update(model, message));
    }, toInternal(initialState));
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        execute(internal[kCommand], message);
    }, [internal[kCommand]]);
    /* eslint-enable */
    useEffect(() => {
        if (subscribe) {
            return subscribe(message);
        }
    });
    return [internal, message];
}
function toInternal(pair) {
    const [model, command] = pair;
    return {
        ...model,
        [kCommand]: command
    };
}
//# sourceMappingURL=main.js.map