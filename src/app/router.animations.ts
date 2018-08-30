import {
  trigger,
  stagger,
  animate,
  style,
  group,
  query,
  keyframes,
  transition
} from "@angular/animations";

export const routerTransition = trigger("routerTransition", [
  transition("* <=> *", [
    query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
      optional: true
    }),
    query(".animatedBlock", style({ opacity: 0 }), { optional: true }),
    group([
      query(
        ":enter",
        [
          style({ transform: "translateX(100%)" }),
          animate("0.5s ease-in-out", style({ transform: "translateX(0%)" }))
        ],
        { optional: true }
      ),
      query(
        ":leave",
        [
          style({ transform: "translateX(0%)" }),
          animate("0.5s ease-in-out", style({ transform: "translateX(-100%)" }))
        ],
        { optional: true }
      )
    ]),
    group([
      query(
        ":enter .animatedBlock.leftToRight",
        animate(
          "0.5s",
          keyframes([
            style({ transform: "translateX(-150px)" }),
            style({ transform: "translateX(-25px)", opacity: 0.25 }),
            style({ transform: "translateX(50px)", opacity: 0.5 }),
            style({ transform: "translateX(-25px)", opacity: 0.75 }),
            style({ transform: "translateX(0px)", opacity: 1 })
          ])
        )
      ),
      query(
        ":enter .animatedBlock.rightToLeft",
        animate(
          "0.5s",
          keyframes([
            style({ transform: "translateX(150px)" }),
            style({ transform: "translateX(25px)", opacity: 0.25 }),
            style({ transform: "translateX(-50px)", opacity: 0.5 }),
            style({ transform: "translateX(25px)", opacity: 0.75 }),
            style({ transform: "translateX(0px)", opacity: 1 })
          ])
        )
      )
    ])
  ])
]);
