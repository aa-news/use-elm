import React from 'react';
export type BaseCommand = {
    type: string;
};
export declare function useElm<Model, Message, Command extends BaseCommand>(initialState: [Model, Command], update: (model: Model, message: Message) => [Model, Command], execute: (command: Command, message: (m: Message) => void) => void, subscribe?: (message: (m: Message) => void) => () => void): [Model, React.Dispatch<Message>];
