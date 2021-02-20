/* eslint-disable max-classes-per-file, no-console */

import { Spork } from './Spork';
import SporkHandler from './SporkHandler';

@Spork()
class ExampleEvent1 {}

@Spork()
class ExampleEvent2 {
    public data1: any = null;

    constructor(data1: any) {
        this.data1 = data1;
    }
}

const sporkHandler = new SporkHandler();

sporkHandler.on(ExampleEvent1).subscribe((res) => {
    console.log('1', res);
});

sporkHandler.on(ExampleEvent2).subscribe((res) => {
    console.log('2', res);
});

sporkHandler.dispatch(new ExampleEvent1());
sporkHandler.dispatch(new ExampleEvent2({ test: 1 }));
