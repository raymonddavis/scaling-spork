import 'reflect-metadata';
import { ISporkOptions } from './ISporkOptions';

export const SPORK_METADATA = 'spork-metadata';
export const SPORK_OPTIONS = 'spork-options';

export function Spork(options?: ISporkOptions) {
    return <T extends new (...args: {}[]) => object>(target: T) => {
        Reflect.defineMetadata(SPORK_METADATA, Symbol(SPORK_METADATA), target);

        if (options) {
            Reflect.defineMetadata(SPORK_OPTIONS, options, target);
        }
    };
}
