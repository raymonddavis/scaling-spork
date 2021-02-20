import {Spork} from "./Spork";
import {SporkHandler} from "./SporkHandler";

@Spork()
class ExampleEvent1 {}

@Spork()
class ExampleEvent2 {
    constructor(public data1: any) {}
}

const sporkHandler = new SporkHandler()

sporkHandler.on(ExampleEvent1)
.subscribe(res => console.log('1', res))

sporkHandler.on(ExampleEvent2)
.subscribe(res => console.log('2', res))

sporkHandler.dispatch(new ExampleEvent1())
sporkHandler.dispatch(new ExampleEvent2({ test: 1 }))
