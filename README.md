<h1 align="center">Pop-a-loon</h1>

<p align="center">
The new rising trend (literally) that changes the browser game completely.
</p>

<div align="center">

[![GitHub contributors](https://img.shields.io/github/contributors/SimonStnn/pop-a-loon)](https://github.com/SimonStnn/pop-a-loon/graphs/contributors)
[![GitHub Release Date](https://img.shields.io/github/release-date-pre/SimonStnn/pop-a-loon)](https://github.com/SimonStnn/pop-a-loon/releases/latest)
[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/pahcoancbdjmffpmfbnjablnabomdocp?logo=googlechrome)](https://chromewebstore.google.com/detail/empty-title/pahcoancbdjmffpmfbnjablnabomdocp)
[![Chrome Web Store Rating](https://img.shields.io/chrome-web-store/rating/pahcoancbdjmffpmfbnjablnabomdocp?logo=googlechrome)
](https://chromewebstore.google.com/detail/pop-a-loon/pahcoancbdjmffpmfbnjablnabomdocp/reviews)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/pop-a-loon?logo=firefox)](https://addons.mozilla.org/.../firefox/addon/pop-a-loon/)
[![Mozilla Add-on Rating](https://img.shields.io/amo/rating/pop-a-loon?logo=firefox)](https://addons.mozilla.org/.../firefox/addon/pop-a-loon/reviews/)

</div>

Pop-a-loon is a browser extension that adds balloons to every website you visit. The balloons rise up the page and can be popped by clicking on them. See the [installation](#installation) instructions to get started with the extension.

![Screenshot-1](./docs/images/Screenshot-1-1280x800.png)

> Balloons rise up the page on every website you visit. Click on them to pop them and earn points!
>
> View your score and the number of balloons popped in the extension popup.

![Screenshot-2](./docs/images/Screenshot-2-1280x800.png)

> Pop as many balloons as you can to earn points and climb the leaderboard!
> _Leaderboard from 16/05/2024_

![Screenshot-3](./docs/images/Screenshot-3-1280x800.png)

> Customize your experience in the extension settings.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [Chrome Web Store](#chrome-web-store)
  - [Firefox Add-ons](#firefox-add-ons)
  - [Manual Installation](#manual-installation)
- [Documentation](#documentation)

## Installation

### Chrome Web Store

1. Visit the [Chrome Web Store](https://chromewebstore.google.com/detail/empty-title/pahcoancbdjmffpmfbnjablnabomdocp).
1. Click on "Add to Chrome" to install the extension.
1. Click on "Add Extension" in the pop-up window to confirm the installation.

   > Chrome will prompt: _Add "Pop-a-loon"? It can: Read and change all your data on all websites_. This is a standard permission for extensions that modify the appearance of web pages. Pop-a-loon does not collect any personal data. [^1]

1. The extension is now installed and ready to use. Balloons will start rising soon!

### Firefox Add-ons

1. Visit the [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/pop-a-loon/).
2. Click on "Add to Firefox" to install the extension.
3. Click on "Add" in the pop-up window to confirm the installation.

   > Firefox will prompt: _Add "Pop-a-loon"?_. This is a standard permission for extensions that modify the appearance of web pages. Pop-a-loon does not collect any personal data. [^1]

4. The extension is now installed and ready to use. Balloons will start rising soon!

### Manual Installation

Refer to the [docs](./docs/README.md#getting-started) for manual installation instructions.

## Documentation

For more information about the architecture of the extension and on how to get started with development and building the extension, refer to the [documentation](./docs#readme).

[^1]: The extension runs a small script on every page that adds balloons to the page. To do this it needs this permission. You can view this script in [src/content/content.ts](./src/content/content.ts).
