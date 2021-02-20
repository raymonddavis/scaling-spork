import 'reflect-metadata';
import { ISpork } from './ISpork';

export const SPORK_METADATA = 'spork';

export function Spork() {
    return <T extends new (...args: {}[]) => ISpork>(target: T) => {
        Reflect.defineMetadata(SPORK_METADATA, Symbol(SPORK_METADATA), target);
    };
}
