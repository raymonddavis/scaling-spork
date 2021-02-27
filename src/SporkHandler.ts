import { Observable, Subject } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';
import { SporkMetaDataValue, SPORK_METADATA } from './Spork';
import MissingSporkError from './MissingSporkError';
import { ISpork } from './ISpork';
import { DefaultOptions, ISporkOptions } from './ISporkOptions';

export default class SporkHandler {
    private $events = new Subject<any>();

    private lastEmits: { [event: string]: any } = {};

    public dispatch<T extends object>(...events: T[]): void {
        const badClassNames: string[] = [];

        events.flat(Infinity).forEach((event) => {
            const metadataValue: SporkMetaDataValue = Reflect.getMetadata(
                SPORK_METADATA,
                event.constructor,
            );

            if (metadataValue) {
                this.$events.next(event);

                if (metadataValue.options.emitLast) {
                    this.lastEmits[metadataValue.symbol.description] = event;
                }
            } else {
                const defaultName = 'A class must be used.';
                const foundClassName = event.constructor.name;
                let className = foundClassName;

                if (
                    foundClassName === undefined ||
                    foundClassName === 'Object'
                ) {
                    className = defaultName;
                }
                badClassNames.push(className);
            }
        });

        if (badClassNames.length) {
            throw new MissingSporkError(badClassNames);
        }
    }

    public on<T extends object = any>(
        eventType: ISpork<T> = null,
        options: ISporkOptions = DefaultOptions,
    ): Observable<T> {
        let obs$: Observable<any> = this.$events;

        if (eventType === null) {
            return obs$;
        }

        const eventTypeMetadata: SporkMetaDataValue = Reflect.getMetadata(
            SPORK_METADATA,
            eventType,
        );

        if (!eventTypeMetadata) {
            const defaultName = 'A class must be used.';
            const foundClassName = (eventType as any).name;
            let className = foundClassName;

            if (
                foundClassName === undefined ||
                typeof eventType !== 'function'
            ) {
                className = defaultName;
            }

            throw new MissingSporkError([className]);
        }

        obs$ = obs$.pipe(
            filter((e) => {
                const metadata: SporkMetaDataValue = Reflect.getMetadata(
                    SPORK_METADATA,
                    e.constructor,
                );
                return metadata.symbol === eventTypeMetadata.symbol;
            }),
        );

        if (
            options.emitLast &&
            this.lastEmits.hasOwnProperty(eventTypeMetadata.symbol.description)
        ) {
            obs$ = obs$.pipe(
                startWith(this.lastEmits[eventTypeMetadata.symbol.description]),
            );
        }

        return obs$;
    }
}
