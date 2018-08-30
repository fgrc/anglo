import {
  trigger,
  state,
  stagger,
  animate,
  style,
  group,
  query,
  transition,
  keyframes
} from "@angular/animations";

export const sidebarTransitions = [
  trigger("fadeIn", [
    transition(":enter", [
      style({ opacity: "0", transform: "translateY(100px)" }),
      animate(
        ".5s ease-out",
        style({ opacity: "1", transform: "translateY(0px)" })
      )
    ])
  ]),
  trigger("toggleSidebar", [
    state(
      "close",
      style({
        width: "0px",
        opacity: "0",
        padding:"0px",
        display: "none"
      })
    ),
    state(
      "open",
      style({
        display: "block"
      })
    ),
    transition("close => open", [
      query(
        ":enter .animation-ready-min-width",
        animate("0.5s 0ms", style({ opacity: 1 })),
        { optional: true }
      ),
      animate("500ms")
    ]),
    transition("open => close", [
      query(
        ":leave .animation-ready-min-width",
        animate("0.5s 0ms", style({ opacity: 0 })),
        { optional: true }
      ),
      animate("500ms")
    ])
  ])
];
