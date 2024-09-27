# Fast

Just like the [default balloon](./default.md), but way faster.

```mermaid
classDiagram
direction LR
class Balloon { <<Abstract>> }
click Balloon href "#abstract-balloon-class" "Abstract balloon class"

class Fast {
  +spawn_chance: number$
  +<< get >>name: string
  +<< get >>options: BalloonOptions
}
Fast --|> Balloon
```

Has a custom image resource in [`/resources/balloons/fast/balloon.svg`](/resources/balloons/fast/balloon.svg).

![Fast balloon](/resources/balloons/fast/balloon.svg)