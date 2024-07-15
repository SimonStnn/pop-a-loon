<h1 align="center">Architecture</h1>

The pop-a-loon architecture is designed to be modular and extensible. This document provides an overview of the architecture of the extension.

## Table of Contents

<!-- markdownlint-disable link-fragments -->

- [Table of Contents](#table-of-contents)
- [Directory Structure](#directory-structure)
- [Polyfilling](#polyfilling)
- [Webpack](#webpack)
  - [Environment Variables](#environment-variables)
  - [Resources folder](#resources-folder)
- [Managers](#managers)
  - [Log](#log)
  - [Storage](#storage)
- [Manifest](#manifest)
- [Background](#background)
- [Content Scripts](#content-scripts)
- [Popup](#popup)
- [Testing](#testing)
- [Building and Deployment](#building-and-deployment)

<!-- markdownlint-enable link-fragments -->

## Directory Structure

- `docs/`: Contains documentation files.
- `resources/`: Contains resources used in the extension and are all available when the extension is running.
- `src/`: This directory contains the source code of the extension.
  - `popup/`: Contains the code for the popup UI of the extension.
  - `background/`: Contains the background scripts of the extension.
  - `content/`: Contains the content scripts of the extension.
  - `utils.ts`: Contains utility functions used across the extension.
- `tests/`: Contains test files for the extension.
- `manifest.json`: The manifest file of the extension, which provides important metadata for the extension.

## Polyfilling

To ensure compatibility with multiple browsers, the pop-a-loon extension uses the [webextension polyfill](https://github.com/mozilla/webextension-polyfill) library. This polyfill provides a consistent API for browser extensions across different browsers, allowing the extension to work seamlessly on Chrome, Firefox, and other supported browsers.

By including the webextension polyfill in the background scripts and content scripts, the extension can make use of browser APIs and features without worrying about browser-specific implementations. This greatly simplifies the development process and ensures a consistent experience for users on different browsers.

This means when you want to access browser API's you don't use the `chrome` or `browser` namespaces directly. You first import the polyfill and then use the `browser` namespace.

```ts
import browser from 'webextension-polyfill';

// For example query some tabs
const tabs = await browser.tabs.query({ active: true });
```

Now, after compiling the extension, the polyfill will be included and make the code access the correct browser API's.

## Webpack

The pop-a-loon extension uses [Webpack](https://webpack.js.org/) to compile its JavaScript code. The webpack configuration is set up to compile the background scripts, popup UI and an entry for each content script into separate bundles. This allows for better organization of the code and ensures that each part of the extension is compiled correctly. Configuration can be found in the [webpack.config.js](/webpack.config.js) file.

### Environment Variables

The webpack configuration uses environment variables to determine the build mode. The `NODE_ENV` environment variable is used to determine whether the extension is being built for development or production. This allows for different optimizations and settings to be applied based on the build mode.

Webpack also sets some environment variables for the extension. In the source code they are accessed via the `process.env` object. For example, the `process.env.NODE_ENV` variable is used to determine the build mode.

> [!WARNING]
> The `process` namespace is not available in the browser. This is a Node.js specific feature. Webpack replaces the `process` object with the correct values during compilation. (e.g. `process.env.NODE_ENV` is replaced with `production`).

### Resources folder

The `resources` folder contains all the resources used in the extension. This includes images, icons, and other assets that are used in the extension. These resources are copied to the build directory during the compilation process and are available when the extension is running.

## Managers

Pop-a-loon has a few custom managers that handle different aspects of the extension.

### Log

The `log` manager is used to log messages to the console. It provides a simple interface for logging messages with different levels of severity, such as `info`, `warn`, and `error`.

```ts
import log from '@/managers/log';

log.debug('This is a debug message');
log.info('This is an info message');
log.warn('This is a warning message');
log.error('This is an error message');
log.softwarn(
  "Like the warning message but doesn't throw an actual warning in the console"
);
log.softerror(
  "Like the error message but doesn't throw an actual error in the console"
);
```

This manager also includes log functionallity from the console namespace. Like `log.time`, `log.timeEnd`, `log.group`, `log.groupEnd`, ….

### Storage

The `storage` managers provides a type-safe way to interact with the browser storage via the browser API's.

```ts
import storage from '@/managers/storage';

const config = await storage.sync.get('config');
await storage.sync.set('config', {
  ...config,
  popVolume: 0.5,
});
```

In this example we update the `popVolume` property of the `config` object in the `sync` storage.

## Manifest

The [`manifest.json`](/manifest.json) file is the metadata file for the extension. It contains information about the extension, such as its name, version, description, and permissions. The manifest file also specifies the background scripts, content scripts, and popup UI of the extension.

There are also browser specific manifest files. These are used to specify browser specific settings. For example, the [`manifest.firefox.json`](/manifest.firefox.json) file is used to specify a `browser_specific_settings` key that is only available in Firefox.

The browser specific manifest files are merged with the base manifest file during the build process. This allows for browser-specific settings to be applied when the extension is compiled. The browser specific manifest file keys can override the options defined in the base manifest file.

## Background

The background scripts handle events and perform tasks that require access to browser APIs.

Read the [background scripts documentation](./architecture/background.md) for more information.

## Content Scripts

Content scripts are injected into web pages and have access to the DOM. This is used to make the balloons appear on web pages.

Read the [content scripts documentation](./architecture/content-scripts.md) for more information.

## Popup

The popup UI provides a user-friendly interface for accessing the extension's features. It can display information, receive user input. It acts as a bridge between the user and the extension and is internally just a web page.

Read the [popup documentation](./architecture/popup.md) for more information.

## Testing

Run the following command to run tests:

```bash
npm run test
```

## Building and Deployment

See [the development guide](./README.md#development).
