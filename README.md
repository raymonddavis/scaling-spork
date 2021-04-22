# scaling-spork

This is to help larger applications communicate within itself at a global level
without the pieces having to acknowledge each other.

## Install

```
$ npm i scaling-spork
```

## Usage

```js
import { Spork, SporkHandler } from 'scaling-spork';

@Spork()
class ExampleEvent1 {}

@Spork()
class ExampleEvent2 {
    public data1: any = null;

    constructor(data1: any) {
        this.data1 = data1;
    }
}

@Spork({ emitLast: true })
class ExampleEvent4 {}

@Spork({ emitLast: true })
class ExampleEvent5 {}

const sporkHandler = new SporkHandler();

sporkHandler.on().subscribe((res) => console.log('logger: ', res));

sporkHandler.dispatch(new ExampleEvent5());
sporkHandler.dispatch(new ExampleEvent4());

sporkHandler.on(ExampleEvent1).subscribe((res) => {
    console.log('1', res);
});

sporkHandler.on(ExampleEvent2).subscribe((res) => {
    console.log('2', res.data1);
});

sporkHandler.dispatch(new ExampleEvent1());
sporkHandler.dispatch(new ExampleEvent2({ test: 1 }));

sporkHandler.on(ExampleEvent4, { emitLast: true }).subscribe((res) => {
    console.log('4', res);
});
```

Simply add `@Spork()` on a class you want to use with the handler.
Any class will work with or without data in the class and regardless if the class is using a constructor.
