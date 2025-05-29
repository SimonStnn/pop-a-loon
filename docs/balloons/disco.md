# Disco

The disco balloon is a colorful, spinning balloon with flashing gradient colors and a glowing effect, perfect for adding a party atmosphere to your browsing experience.

```mermaid
classDiagram
direction LR
class Balloon { <<Abstract>> }
click Balloon href "#abstract-balloon-class" "Abstract balloon class"

class Disco {
  +spawn_chance: number$
  +<< get >>name: string
  +<< get >>options: BalloonOptions
  +build() void
}
Disco --|> Default
```

Has a custom image resource in [`/resources/balloons/disco/balloon.svg`](/resources/balloons/disco/balloon.svg).

![Disco balloon](/resources/balloons/disco/balloon.svg)
