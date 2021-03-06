/* eslint-disable max-classes-per-file, no-console */
import { Spork, SporkHandler } from '..';

@Spork()
class ExampleEvent1 {}

@Spork()
class ExampleEvent2 {
    public data1: any = null;

    constructor(data1: any) {
        this.data1 = data1;
    }
}

// class ExampleEvent3 {}

@Spork({ emitLast: true })
class ExampleEvent4 {}

@Spork({ emitLast: true })
class ExampleEvent5 {}

const sporkHandler = new SporkHandler();

sporkHandler.on().subscribe((res: any) => console.log('logger: ', res));

sporkHandler.dispatch(new ExampleEvent5());
sporkHandler.dispatch(new ExampleEvent4());

sporkHandler.on(ExampleEvent1).subscribe((res: ExampleEvent1) => {
    console.log('1', res);
});

sporkHandler.on(ExampleEvent2).subscribe((res: ExampleEvent2) => {
    console.log('2', res.data1);
});

// sporkHandler.on(ExampleEvent3).subscribe((res) => {
// console.log('3', res);
// });

sporkHandler.dispatch(new ExampleEvent1());
sporkHandler.dispatch(new ExampleEvent2({ test: 1 }));
// sporkHandler.dispatch(new ExampleEvent3());

sporkHandler
    .on(ExampleEvent4, { emitLast: true })
    .subscribe((res: ExampleEvent4) => {
        console.log('4', res);
    });
