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
    transition('close => open', [
      query(
        ':enter .animation-ready-min-width',
        animate('1s 0ms', style({ opacity: 1 })),
        { optional: true }
      ),
      animate('1000ms')]
    ),
    transition('open => close', [
      query(
        ':leave .animation-ready-min-width',
        animate('1s 0ms', style({ opacity: 0 })),
        { optional: true }
      ),
      animate('1000ms')]
    )
  ])
];
