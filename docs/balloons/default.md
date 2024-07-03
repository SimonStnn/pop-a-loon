# Default

The default balloon is a simple balloon that rises and pops when clicked.

```mermaid
classDiagram
direction LR
class Balloon { <<Abstract>> }
click Balloon href "#abstract-balloon-class" "Abstract balloon class"

class Default {
  +spawn_chance: number$
  +<< get >>name: string
  +<< get >>options: BalloonOptions
  +<< get >>balloonImageUrl: string
  +<< get >>popSoundUrl: string
  +balloonImage: HTMLImageElement
  +popSound: HTMLAudioElement
  +constructor()
  #originalPath(path: string) string
  +build() void
  +pop() Promise~void~
}
Default --|> Balloon

class BalloonOptions {
  <<Type>>
  dir_name: string
  imageUrl: string
  popSoundUrl: string
  riseDurationThreshold: [number, number]
  swingDurationThreshold: [number, number]
}

Default <|-- BalloonOptions
```

## Inheriting

To create a new balloon, extend the `Default` class and implement the abstract methods.

```ts
class Example extends Default {
  public static readonly spawn_chance: number = 0.25;
  // @ts-ignore
  public get name(): 'example' {
    return 'example';
  }

  public get options(): BalloonOptions {
    return {
      ...super.options,
      // Override options here
      // e.g. the image url
      imageUrl: 'example.svg',
    };
  }
}
```

In this example the `Example` class extends the `Default` class and overrides the `spawn_chance`, `name` and `options` properties. The options property overrides the image url to `example.svg`. Pop-a-loon will look for this `example.svg` file in the `resources/balloons/example` directory.
