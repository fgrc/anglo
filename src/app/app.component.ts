import { Component } from '@angular/core';
//this has been modified to support animations
//the guide used for this modifications is located at:
//https://medium.com/google-developer-experts/angular-supercharge-your-router-transitions-using-new-animation-features-v4-3-3eb341ede6c8
import { routerTransition } from './router.animations';

@Component({
  selector: 'app-root',
  animations: [ routerTransition ],
  template: `
    <layout [@routerTransition]="getState(o)">
        <router-outlet #o="outlet"></router-outlet>
    </layout>
  `,
  styles: []
})
export class AppComponent {
  title = 'app';
  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
