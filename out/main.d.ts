import React from 'react';
export interface Cmd<M> {
    cmdName: string;
    execute(sendMessage: (m: M) => void): void;
}
export declare const cmdNone: Cmd<any>;
export interface Sub<M> {
    subName: string;
    setup(sendMessage: (m: M) => void): () => void;
}
export default function useElm<Model, Message>(initialPair: [Model, Cmd<Message>], update: (model: Model, message: Message) => [Model, Cmd<Message>], subscriptions: Sub<Message>[], enableLogging?: boolean): [Model, React.Dispatch<Message>];
