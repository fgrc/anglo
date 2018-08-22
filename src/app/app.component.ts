import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <layout>
        <router-outlet></router-outlet>
    </layout>
  `,
  styles: []
})
export class AppComponent {
  title = 'app';
}
