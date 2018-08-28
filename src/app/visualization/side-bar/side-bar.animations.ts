import {trigger,state, stagger, animate, style, group, query, transition} from '@angular/animations';

export const sidebarTransitions = [
  trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: '0',transform: 'translateY(100px)' }),
      animate('.5s ease-out', style({ opacity: '1',transform: 'translateY(0px)' })),
    ]),
  ]),
  trigger('toggleSidebar', [
    state('close', style({
      width:'0px',
      opacity: '0',
      display:'none'
    })),
    state('open',   style({
      display:'block'
    })),
    transition('close => open', animate('1000ms ease-in')),
    transition('open => close', animate('1000ms ease-out'))
  ])
];
