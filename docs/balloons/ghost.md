# Ghost

This is a balloon spawned from the spiritworld. Just like a ghost this balloon sways from side to side en turns slightly invisible.

```mermaid
classDiagram
direction LR
class Balloon { <<Abstract>> }
click Balloon href "#abstract-balloon-class" "Abstract balloon class"

class Ghost {
  +spawn_chance: number$
  +<< get >>name: string
  +<< get >>options: BalloonOptions
}
Ghost --|> Balloon
```

Has a custom image resource in [`/resources/balloons/ghost/balloon.svg`](/resources/balloons/ghost/balloon.svg).

![Ghost balloon](/resources/balloons/ghost/balloon.svg)