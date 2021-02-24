import { Observable, Subject } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';
import { ISporkClass } from './ISporkClass';
import { DefaultSporkOptions, ISporkOptions } from './ISporkOptions';
import { Spork } from './Spork';

export default class SporkHandler {
    private $events = new Subject<any>();

    private lastEmits: { [event: string]: any } = {};

    public dispatch<T extends object>(...events: (T | Spork)[]): void {
        events.flat(Infinity).forEach((e) => {
            let options: ISporkOptions = null;

            if (e instanceof Spork) {
                options = e.sporkOptions;
                delete e.sporkOptions;
            }

            this.$events.next(e);

            if (options && options.emitLast) {
                this.lastEmits[e.constructor.name] = e;
            }
        });
    }

    public on<T extends object>(
        eventType: ISporkClass<T>,
        options: ISporkOptions = DefaultSporkOptions,
    ): Observable<T> {
        let obs$ = this.$events.pipe(
            filter((e) => e.constructor === eventType),
        );

        if (options.emitLast && this.lastEmits.hasOwnProperty(eventType.name)) {
            obs$ = obs$.pipe(startWith(this.lastEmits[eventType.name]));
        }

        return obs$;
    }
}
