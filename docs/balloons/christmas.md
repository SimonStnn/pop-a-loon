# Christmas Balloon

The Christmas Balloon uses the complete artwork in `resources/balloons/christmas/balloon.svg` and inherits the regular balloon's movement and pop behavior. The hat is part of that SVG, so there is no separate hat overlay or mask. It plays its own pop sound and releases a short burst of drifting snow when popped.

The Christmas Balloon can spawn from November 15 through December 30, inclusive, using the Europe/Brussels calendar date. The date rule repeats automatically each year. In development builds, seasonal balloons are available year-round for testing.

## Assets

- Christmas balloon SVG: `resources/balloons/christmas/balloon.svg`
- Pop sound: `resources/balloons/christmas/pop.mp3`

Adjust the overall artwork size through the inherited `size` option in `src/balloons/christmas.ts` if needed. The snow animation is defined in `resources/balloons/christmas/christmas.css`.

The spawn weight and season dates are defined in `src/balloons/christmas.ts`.

The generic date range helper is covered in `tests/utils/season.test.ts`.
