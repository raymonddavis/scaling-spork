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

// Only need to extend if using options
class ExampleEvent1 extends Spork {
    sporkOptions = {
        emitLast: true,
    };
    message: string;
    constructor(message: string) {
        super(); // Only needed if using a constructor
        this.message = message;
    }
}

class ExampleEvent2 {
    data = {
        test: 1,
    };
}

class ExampleEvent3 {
    id?: number;
}

const sporkHandler = new SporkHandler();

sporkHandler.dispatch(new ExampleEvent1('Before .on'));
sporkHandler.on(ExampleEvent1, { emitLast: true }).subscribe((res) => {
    console.log('1', res);
});

sporkHandler.on(ExampleEvent2).subscribe((res) => {
    console.log('2', res);
});
sporkHandler.dispatch(new ExampleEvent2());

sporkHandler.on(ExampleEvent3).subscribe((res) => {
    console.log('3', res);
});

const ex3 = new ExampleEvent3();
ex3.id = 1;
const arr = [
    { id: 0 } as ExampleEvent3, // doe not work must call new
    ex3,
    new ExampleEvent3(),
    new ExampleEvent3(),
    [
        new ExampleEvent3(),
        new ExampleEvent3(),
        new ExampleEvent3(),
        new ExampleEvent3(),
    ],
];
sporkHandler.dispatch(arr);
```

Simply extend off the Spork class if you want to use any of the options. (Currently only option is emit last)
Any class will work with or without data in the class and regardless if the class is using a constructor.
