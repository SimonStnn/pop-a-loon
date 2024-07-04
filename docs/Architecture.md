<h1 align="center">Architecture</h1>

The pop-a-loon architecture is designed to be modular and extensible. This document provides an overview of the architecture of the extension.

## Table of Contents

<!-- markdownlint-disable link-fragments -->

- [Table of Contents](#table-of-contents)
- [Directory Structure](#directory-structure)
- [Workflow](#workflow)
  - [Polyfilling](#polyfilling)
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

## Workflow

### Polyfilling

To ensure compatibility with multiple browsers, the pop-a-loon extension uses the [webextension polyfill](https://github.com/mozilla/webextension-polyfill) library. This polyfill provides a consistent API for browser extensions across different browsers, allowing the extension to work seamlessly on Chrome, Firefox, and other supported browsers.

By including the webextension polyfill in the background scripts and content scripts, the extension can make use of browser APIs and features without worrying about browser-specific implementations. This greatly simplifies the development process and ensures a consistent experience for users on different browsers.

This means when you want to access browser API's you don't use the `chrome` or `browser` namespaces directly. You first import the polyfill and then use the `browser` namespace.

```ts
import browser from 'webextension-polyfill';

// For example query some tabs
const tabs = await browser.tabs.query({ active: true });
```

Now, after compiling the extension, the polyfill will be included and make the code access the correct browser API's.

### Background

The background scripts handle events and perform tasks that require access to browser APIs.

Read the [background scripts documentation](./architecture/background.md) for more information.

### Content Scripts

Content scripts are injected into web pages and have access to the DOM. This is used to make the balloons appear on web pages.

Read the [content scripts documentation](./architecture/content-scripts.md) for more information.

### Popup

The popup UI provides a user-friendly interface for accessing the extension's features. It can display information, receive user input. It acts as a bridge between the user and the extension and is internally just a web page.

Read the [popup documentation](./architecture/popup.md) for more information.

## Testing

Run the following command to run tests:

```bash
npm run test
```

## Building and Deployment

See [the development guide](./README.md#development).
