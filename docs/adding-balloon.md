<h1 align="center">Adding a new balloon</h1>

Adding a new balloon to the extension is a simple process. In this document we will go over the steps to add a new balloon.

## Table of Contents

<!-- markdownlint-disable link-fragments -->

- [Table of Contents](#table-of-contents)
- [Choosing a name](#choosing-a-name)
- [Implementation](#implementation)
  - [Extending the abstract balloon class](#extending-the-abstract-balloon-class)
  - [Extending the Default balloon class](#extending-the-default-balloon-class)
- [Making the balloon available](#making-the-balloon-available)
- [Tests](#tests)
- [Documentation](#documentation)

<!-- markdownlint-enable link-fragments -->

## Choosing a name

The name of the balloon is prefered to be a single word. The name should fit in the text `<name> balloon`. This name will be used in the UI.

## Implementation

Each balloon is it's own class. To add a new balloon, create a new file in the [`/src/balloons/`](/src/balloons/) directory. The file should be named `<name>.ts`. Make a class in this file and export it. Your new balloon should extend the Balloon class or any other balloon in the [balloon hierarchy](./README.md#inheritance-tree).

### Extending the abstract balloon class

Here we will discuss how to add a balloon extending the [abstract balloon class](./README.md#abstract-balloon-class). This is more complicated as there is less functionality provided in the abstract balloon class.

> [!TIP]
> For a simpler implementation refer to [extending the Default balloon class](#extending-the-default-balloon-class). This class has more functionality implemented.

```ts
// example.ts
import Balloon from '@/balloon';

export default class Example extends Balloon {
  public static readonly spawn_chance: number = 0.1;
  public readonly name = 'example';

  public build() {
    // Build the balloon element with the `this.element` div
  }
}
```

Now you build your class you can [make your balloon available](#making-the-balloon-available) to pop-a-loon and see it on screen.

### Extending the Default balloon class

Extending the [Default balloon](./balloons/default.md) is a simpler process.

```ts
// example.ts
class Example extends Default {
  public static readonly spawn_chance: number = 0.1;
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

In this example the `Example` class extends the `Default` class and overrides the `spawn_chance`, `name` and `options` properties. The options property overrides the image url to `example.svg`. Pop-a-loon will look for this `example.svg` file in the `resources/balloons/example` directory. The image for the balloon doesn't need to be an `svg`, but it is recommended.

You can find what other options you can override in the [default balloon documentation](./balloons/default.md). Further implementation is up to you.

Now you build your class you can [make your balloon available](#making-the-balloon-available) to pop-a-loon and see it on screen.

## Making the balloon available

Now we need to export it from the [`/src/balloons/`](/src/balloons/) module. So we include it in [`/src/balloons/index.ts`](/src/balloons/index.ts)

```ts
// index.ts
// ... other balloons
export { default as Example } from './example';
// ... other balloons
```

Balloon exports happen preferable in alphabetical order.

## Tests

Add your balloon test file to the [`/tests/`](/tests/) folder with the name: `<name>.test.ts` and add the required tests that need to pass for your balloon.

## Documentation

Add your balloon documentation to the [`/docs/balloons/`](/docs/balloons/) folder with the name: `<name>.md` and add there the documentation for your balloon.

Add your balloon spawn chance to the [balloon spawn chances](./README.md#balloon-spawn-chances) and the balloon class to the [inheritance tree](./README.md#inheritance-tree). Refer to your balloon documentation at the [Balloons section](./README.md#balloons).
