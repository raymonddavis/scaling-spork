import { Component } from '@angular/core';
import { Spork, SporkHandler } from 'scaling-spork';
import { tap } from 'rxjs/operators';

@Spork()
class ExampleEvent1 {}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'example-app';

  sporkStream: SporkHandler = new SporkHandler();

  constructor() {
    this.sporkStream.on().pipe(tap(console.log)).subscribe();

    this.sporkStream.dispatch(new ExampleEvent1());
  }
}
