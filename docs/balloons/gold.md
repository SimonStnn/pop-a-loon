# Gold

Just like the [default balloon](./default.md), but :sparkles: golden :sparkles:.

```mermaid
classDiagram
direction LR
class Balloon { <<Abstract>> }
click Balloon href "#abstract-balloon-class" "Abstract balloon class"

class Gold {
  +spawn_chance: number$
  +<< get >>name: string
  +<< get >>options: BalloonOptions
}
Gold --|> Balloon
```

Has a custom image resource in [`/resources/balloons/gold/balloon.svg`](/resources/balloons/gold/balloon.svg).

![Gold balloon](/resources/balloons/gold/balloon.svg)
