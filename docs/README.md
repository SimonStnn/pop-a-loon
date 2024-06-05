<h1 align="center">Pop-a-loon documentation</h1>

## Table of Contents

<!-- markdownlint-disable link-fragments -->

- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Development](#development)
    - [dev:chrome](#devchrome)
    - [dev:chrome:noremote](#devchromenoremote)
    - [dev:chrome:remote](#devchromeremote)
    - [dev:firefox](#devfirefox)
    - [dev:firefox:noremote](#devfirefoxnoremote)
    - [dev:firefox:remote](#devfirefoxremote)
  - [Load the extension to chrome](#load-the-extension-to-chrome)
  - [Load the extension to firefox](#load-the-extension-to-firefox)
  - [Debugging in Visual Studio Code](#debugging-in-visual-studio-code)
  - [Deployment](#deployment)
    - [build:chrome](#buildchrome)
    - [build:chrome:zip](#buildchromezip)
    - [build:firefox](#buildfirefox)
    - [build:firefox:zip](#buildfirefoxzip)
- [Architecture](#architecture)
- [Balloon spawn chances](#balloon-spawn-chances)
- [Balloons](#balloons)
  - [Abstract balloon class](#abstract-balloon-class)
    - [Properties](#properties)
      - [Options](#options)
    - [Methods](#methods)
  - [Default balloon](#default-balloon)
  - [Confetti balloon](#confetti-balloon)

<!-- markdownlint-enable link-fragments -->

## Getting Started

### Requirements

<!-- These are used in development at the time of writing, other versions aren't tested but should work -->

- [Node.js](https://nodejs.org/) (`>= v21.1.0`)
- [npm](https://www.npmjs.com/) (`>= v10.3.0`)

### Installation

Clone the repository:

```bash
git clone https://github.com/SimonStnn/pop-a-loon
```

Install the dependencies:

```bash
npm install
```

### Development

Building for development can be done with the `dev:{browser}` script. Replace `{browser}` with the browser you want to build for. The available options are `chrome` and `firefox`.

> [!TIP]
> See the [Load the extension to chrome](#load-the-extension-to-chrome) and [Load the extension to firefox](#load-the-extension-to-firefox) sections for instructions on how to load the extension in the browser.

#### dev:chrome

<!-- markdownlint-disable link-fragments -->

> [!IMPORTANT]
> This will call the [dev:chrome:noremote](#devchromenoremote) script.

<!-- markdownlint-enable link-fragments -->

To build for Chrome:

```bash
npm run dev:chrome
```

This will build the extension in development mode for chrome. You can also include the `--watch` flag to automatically rebuild the extension when files change.

```bash
npm run dev:chrome -- --watch
```

#### dev:chrome:noremote

To build for Chrome without a remote server:

```bash
npm run dev:chrome:noremote
```

This will build the extension in development mode for chrome without a remote server. You can also include the `--watch` flag to automatically rebuild the extension when files change.

```bash
npm run dev:chrome:noremote -- --watch
```

#### dev:chrome:remote

> [!IMPORTANT]
> This will connect to a [pop-a-loon-backend](https://github.com/SimonStnn/pop-a-loon-backend) server which is expected to be running on `http://localhost:3000`.

To build for Chrome with a remote server:

```bash
npm run dev:chrome:remote
```

#### dev:firefox

<!-- markdownlint-disable link-fragments -->

> [!IMPORTANT]
> This will call the [dev:firefox:noremote](#devfirefoxnoremote) script.

<!-- markdownlint-enable link-fragments -->

To build for Firefox:

```bash
npm run dev:firefox
```

This will build the extension in development mode for firefox. You can also include the `--watch` flag to automatically rebuild the extension when files change.

```bash
npm run dev:firefox -- --watch
```

#### dev:firefox:noremote

To build for Firefox without a remote server:

```bash
npm run dev:firefox:noremote
```

This will build the extension in development mode for firefox without a remote server. You can also include the `--watch` flag to automatically rebuild the extension when files change.

```bash
npm run dev:firefox:noremote -- --watch
```

#### dev:firefox:remote

> [!IMPORTANT]
> This will connect to a [pop-a-loon-backend](https://github.com/SimonStnn/pop-a-loon-backend) server which is expected to be running on `http://localhost:3000`.

To build for Firefox with a remote server:

```bash
npm run dev:firefox:remote
```

This will build the extension in development mode for firefox with a remote server. You can also include the `--watch` flag to automatically rebuild the extension when files change.

```bash
npm run dev:firefox:remote -- --watch
```

### Load the extension to chrome

The extension can be loaded in the browser by following the steps below:

1. Open the Extension Management page by navigating to [`chrome://extensions`](chrome://extensions).

   > Don't forget to enable Developer mode in the top right corner.

2. Click the `Load unpacked` button and select the `dist/` directory.
3. The extension should now be loaded and you can see the icon in the browser toolbar.
4. Pin the extension to the toolbar for easy access.

### Load the extension to firefox

The extension can be loaded in the browser by following the steps below:

1. Open the Add-ons page by navigating to [`about:addons`](about:addons).
2. Click the `Extensions` tab on the left.
3. Click the `Manage your extensions` button.
4. Click the `Debug Add-ons` button.
5. Click the `Load Temporary Add-on` button and select the `manifest.json` file in the `dist/` directory.
6. The extension should now be loaded and you can see the icon in the browser toolbar.
7. Pin the extension to the toolbar for easy access.

### Debugging in Visual Studio Code

1. Open the project in Visual Studio Code.
2. Go to the Run view (Ctrl+Shift+D).
3. Select `Launch Chrome` or `Launch Firefox` from the dropdown at the top of the Run view.
4. Press the Start Debugging button (F5).

This will start the development server (if it's not already running) and open a new browser instance with debugging enabled.

### Deployment

To build the extension for production, use the `build:{browser}` script. Replace `{browser}` with the browser you want to build for. The available options are `chrome` and `firefox`. You can also include `:zip` to create a zip file of the extension.

#### build:chrome

To build for Chrome:

```bash
npm run build:chrome
```

#### build:chrome:zip

This will build the extension in production mode for chrome. You can also include the `:zip` flag to create a zip file of the extension.

```bash
npm run build:chrome:zip
```

The zip file will be created in the `build/` directory.

#### build:firefox

To build for Firefox:

```bash
npm run build:firefox
```

#### build:firefox:zip

This will build the extension in production mode for firefox. You can also include the `:zip` flag to create a zip file of the extension.

```bash
npm run build:firefox:zip
```

The zip file will be created in the `build/` directory.

## Architecture

## Balloon spawn chances

```mermaid
pie showdata
title Balloon spawn chances
   "Default" : 0.90
   "Confetti" : 0.10
```

## Balloons

### Abstract balloon class

The abstract balloon class is the base class for all balloons.

```mermaid
classDiagram
direction LR
class Balloon {
  <<Abstract>>
  +options: BalloonOptions*
  -_popSound: HTMLAudioElement
  #balloonImage: HTMLImageElement
  +element: HTMLDivElement
  +riseDurationThreshold: [number, number]
  +swingDurationThreshold: [number, number]
  +<< get >>name: string
  +<< get >>balloonImageUrl: string
  +<< get >>popSoundUrl: string
  +<< get >>popSound: HTMLAudioElement
  +<< get >>topElement: HTMLDivElement
  +constructor()
  +isRising() boolean
  +rise() void
  +remove() void
  +pop() void
  -_pop() void
}

class BalloonOptions {
  <<Type>>
  name: string
  imageUrl: string | undefined
  popSoundUrl: string | undefined
}

Balloon <|-- BalloonOptions
```

#### Properties

- `options: BalloonOptions` - The [options](#options) for the balloon.
  > This is an abstract property and should be implemented by the subclass.
- `_popSound: HTMLAudioElement` - _private_ - The HTML audio element without the src loaded by default.
- `balloonImage: HTMLImageElement` - _protected_ - The image of the balloon.
- `element: HTMLDivElement` - The element that represents the balloon.
- `riseDurationThreshold: [number, number]` - The range of the duration of the rise animation.
- `swingDurationThreshold: [number, number]` - The range of the duration of the swing animation.
- `name: string` - The name used to identify the balloon.
  > This is the name from the balloon [options](#options).
- `balloonImageUrl: string` - The URL of the image of the balloon.
- `popSoundUrl: string` - The URL of the sound that plays when the balloon pops.
- `popSound: HTMLAudioElement` - The sound that plays when the balloon pops.
  > The sound is loaded when the balloon is created.
- `topElement: HTMLDivElement` - The top element of the balloon.
  > The direct child of the balloon container.

##### Options

- `name: string` - The name of the balloon.
- `imageUrl: string | undefined` - The URL of the image of the balloon.
- `popSoundUrl: string | undefined` - The URL of the sound that plays when the balloon pops.

#### Methods

- `constructor()` - Creates a new balloon.
- `isRising(): boolean` - Returns whether the balloon is rising.
- `rise(): void` - Makes the balloon rise.
- `remove(): void` - Removes the balloon.
- `pop(): void` - Pops the balloon.
- `_pop(): void` - _private_ - Pops the balloon.

### Default balloon

The default balloon is a simple balloon that rises and pops when clicked.

```mermaid
classDiagram
direction LR
class Balloon { <<Abstract>> }
click Balloon href "#abstract-balloon-class" "Abstract balloon class"

class Default {
  +spawn_chance: number$
  +options: BalloonOptions
}
Default --|> Balloon
```

### Confetti balloon

The confetti balloon is a balloon that spawns confetti when popped.

```mermaid
classDiagram
direction LR
class Balloon { <<Abstract>> }
click Balloon href "#abstract-balloon-class" "Abstract balloon class"

class Confetti {
  +spawn_chance: number$
  +options: BalloonOptions
  -mask: HTMLImageElement
  +pop(event: MouseEvent) void
}
Confetti --|> Balloon
```
