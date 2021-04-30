import 'reflect-metadata';
import { DefaultOptions, ISporkOptions } from './ISporkOptions';

export const SPORK_METADATA = 'spork-metadata';

export interface SporkMetaDataValue {
    symbol: Symbol;
    options: ISporkOptions;
}

export function Spork(options?: ISporkOptions) {
    return <T extends new (...args: {}[]) => object>(target: T) => {
        const metadataValue: SporkMetaDataValue = {
            symbol: Symbol(`${SPORK_METADATA}-${target.name}`),
            options: options || DefaultOptions,
        };
        Reflect.defineMetadata(SPORK_METADATA, metadataValue, target);
    };
}
