/* eslint-disable max-classes-per-file, no-console */
import { Spork, SporkHandler } from '..';
import { ISporkOptions } from '../ISporkOptions';

let handler: SporkHandler = null;

beforeEach(() => {
    handler = new SporkHandler();
});

test('Should receive event (without data)', (done) => {
    class ExampleEvent {}

    const expectedReturn = new ExampleEvent();

    handler.on(ExampleEvent).subscribe((res) => {
        expect(res).toBe(expectedReturn);
        done();
    });

    handler.dispatch(expectedReturn);
});

test('Should receive event (with data)', (done) => {
    class ExampleEvent {
        public data: any = null;
    }

    const expectedReturn = new ExampleEvent();
    expectedReturn.data = 5;

    handler.on(ExampleEvent).subscribe((res) => {
        expect(res).toBe(expectedReturn);
        expect(res.data).not.toBeNull();
        expect(res.data).toBe(expectedReturn.data);
        done();
    });

    handler.dispatch(expectedReturn);
});

test('Should receive event (N events to N handlers)', (done) => {
    class ExampleEvent {}

    class ExampleEvent1 {}

    class ExampleEvent2 {}

    const expectedReturn = new ExampleEvent();
    const expectedReturn1 = new ExampleEvent1();
    const expectedReturn2 = new ExampleEvent2();

    handler.on(ExampleEvent).subscribe((res) => {
        expect(res).toBe(expectedReturn);
        done();
    });

    handler.on(ExampleEvent1).subscribe((res) => {
        expect(res).toBe(expectedReturn1);
        done();
    });

    handler.on(ExampleEvent2).subscribe((res) => {
        expect(res).toBe(expectedReturn2);
        done();
    });

    handler.dispatch(expectedReturn);
    handler.dispatch(expectedReturn1);
    handler.dispatch(expectedReturn2);
});

test('Should receive events', (done) => {
    class ExampleEvent {
        public i: number = null;

        constructor(i: number) {
            this.i = i;
        }
    }

    const events: ExampleEvent[] = [];
    const eventCount = 15;

    for (let i = 0; i < eventCount; i++) {
        events.push(new ExampleEvent(i));
    }

    let receivedEvents = 0;

    handler.on(ExampleEvent).subscribe((res) => {
        expect(res).toBe(events[receivedEvents]);
        expect(res.i).not.toBeNull();
        expect(res.i).toBe(events[receivedEvents].i);

        receivedEvents++;
        if (receivedEvents === events.length) {
            done();
        }
    });

    handler.dispatch(events);
});

test('Should receive event (last emitted)', (done) => {
    class ExampleEvent extends Spork {
        sporkOptions: ISporkOptions = {
            emitLast: true,
        };
    }

    const expectedReturn = new ExampleEvent();

    handler.dispatch(expectedReturn);

    handler.on(ExampleEvent, { emitLast: true }).subscribe((res) => {
        expect(res).toBe(expectedReturn);
        done();
    });
});
