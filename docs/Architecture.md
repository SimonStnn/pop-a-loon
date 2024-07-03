<h1 align="center">Architecture</h1>

## Table of Contents

<!-- markdownlint-disable link-fragments -->

- [Table of Contents](#table-of-contents)
- [Directory Structure](#directory-structure)
- [Workflow](#workflow)
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
