import {Observable, Subject} from "rxjs";
import {filter} from "rxjs/operators";
import {ISpork} from "./ISpork";
import {SPORK_METADATA} from "./Spork";

export class SporkHandler {
    private $events = new Subject<any>()

    constructor() {}

    public dispatch<T extends ISpork>(...events: T[]): void {
        events
        .forEach(event => this.$events.next(event))
    }

    public on<T extends ISpork>(eventType: T): Observable<T> {
        const eventTypeMetadata = Reflect.getMetadata(SPORK_METADATA, eventType)
        return this.$events
        .pipe(
            filter(e => {
                const metadata = Reflect.getMetadata(SPORK_METADATA, e.constructor)
                return metadata === eventTypeMetadata
            })
        )        
    }
}
