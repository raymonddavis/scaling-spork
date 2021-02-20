import 'reflect-metadata';

export const SPORK_METADATA = 'spork';

export function Spork() {
    return <T extends new (...args: {}[]) => object>(target: T) => {
        Reflect.defineMetadata(SPORK_METADATA, Symbol(SPORK_METADATA), target);
    };
}
