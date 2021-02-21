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
    public data: any = null;

    constructor(data: any) {
        this.data = data;
    }
}


const sporkHandler = new SporkHandler();

sporkHandler.on(ExampleEvent1).subscribe((res) => {
    console.log(res); // {}
});

sporkHandler.on(ExampleEvent2).subscribe((res) => {
    console.log(res.data); // test
});

sporkHandler.dispatch(new ExampleEvent1());
sporkHandler.dispatch(new ExampleEvent2({ test: 1 }));
```

Simply add `@Spork()` on a class you want to use with the handler.
Any class will work with or without data in the class and regardless if the class is using a constructor.
