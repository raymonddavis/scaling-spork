import { Observable, Subject } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';
import { SPORK_METADATA, SPORK_OPTIONS } from './Spork';
import MissingSporkError from './MissingSporkError';
import { ISpork } from './ISpork';
import { ISporkOptions } from './ISporkOptions';

export default class SporkHandler {
    private $events = new Subject<any>();

    private lastEmits: { [event: string]: any } = {};

    private defaultOptions: ISporkOptions = { emitLast: false };

    public dispatch<T extends object>(...events: T[]): void {
        const badClassNames: string[] = [];

        const flattenedEvents = events.flat();

        flattenedEvents.forEach((event) => {
            const metadata = Reflect.getMetadata(
                SPORK_METADATA,
                event.constructor,
            );

            if (metadata) {
                this.$events.next(event);

                const options: ISporkOptions = Reflect.getMetadata(
                    SPORK_OPTIONS,
                    event.constructor,
                );

                if (options && options.emitLast) {
                    this.lastEmits[event.constructor.name] = event;
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

    public on<T extends object>(
        eventType: ISpork<T>,
        options: ISporkOptions = this.defaultOptions,
    ): Observable<T> {
        const eventTypeMetadata = Reflect.getMetadata(
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

        let obs$ = this.$events.pipe(
            filter((e) => {
                const metadata = Reflect.getMetadata(
                    SPORK_METADATA,
                    e.constructor,
                );
                return metadata === eventTypeMetadata;
            }),
        );

        const className = (eventType as any).name;

        if (options.emitLast && this.lastEmits.hasOwnProperty(className)) {
            obs$ = obs$.pipe(startWith(this.lastEmits[className]));
        }

        return obs$;
    }
}
