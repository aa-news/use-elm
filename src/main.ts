import React, { useEffect, useReducer } from 'react';

export interface Cmd<M> {
    cmdName: string;
    execute(sendMessage: (m: M) => void): void;
}

export const cmdNone: Cmd<any> = { 
    cmdName: 'none', 
    execute() {} 
};

export interface Sub<M> {
    subName: string;
    setup(sendMessage: (m: M) => void): () => void;
}

export default function useElm<Model, Message>(
    initialPair: [Model, Cmd<Message>],
    update: (model: Model, message: Message) => [Model, Cmd<Message>],
    subscriptions: Sub<Message>[],
    enableLogging?: boolean
): [Model, React.Dispatch<Message>] {
    const [internal, sendMessage] = useReducer(
        (model: InternalModel<Model, Message>, message: Message) => {
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
        },

        toInternal(initialPair)
    );

    useEffect(() => {
        internal[kCommand].execute(sendMessage);
    }, [internal[kCommand]]);

    useEffect(() => {
        const allCleanupFns: (() => void)[] = [];

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

type InternalModel<Model, Message> = Model & {
    [kCommand]: Cmd<Message>;
};

function toInternal<Model, Message>(
    pair: [Model, Cmd<Message>]
): InternalModel<Model, Message> {
    const [model, command] = pair;

    return {
        ...model,
        [kCommand]: command
    };
} 
