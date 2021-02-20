import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SPORK_METADATA } from './Spork';
import MissingSporkError from './MissingSporkError';
import { ISpork } from './ISpork';

export default class SporkHandler {
    private $events = new Subject<any>();

    public dispatch<T extends object>(...events: T[]): void {
        const badClassNames: string[] = [];

        events.forEach((event) => {
            const metadata = Reflect.getMetadata(
                SPORK_METADATA,
                event.constructor,
            );

            if (metadata) {
                this.$events.next(event);
            } else {
                const defaultName = 'A class must be used.';
                const foundClassName = event.constructor.name;
                let className = foundClassName;

                if (foundClassName === undefined) {
                    className = defaultName;
                }
                badClassNames.push(className);
            }
        });

        if (badClassNames.length) {
            throw new MissingSporkError(badClassNames);
        }
    }

    public on<T extends object>(eventType: ISpork<T>): Observable<T> {
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

        return this.$events.pipe(
            filter((e) => {
                const metadata = Reflect.getMetadata(
                    SPORK_METADATA,
                    e.constructor,
                );
                return metadata === eventTypeMetadata;
            }),
        );
    }
}
