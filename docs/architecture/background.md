# Background

The background scripts handle events and perform tasks that require access to browser APIs.

## Alarms

The background script creates and listens to alarms. There are currently two alarms:

1. `spawnBalloon`: This alarm goes off at random intervals. When it goes off, the background script sends a content script to one of the active tabs to spawn a balloon. Because you can only specify a specific interval for alarms, e.g. every 5 minutes, the background script creates an alarm that goes off once and then creates a new alarm when that alarm was triggered. This new alarm will have a different random delay. This way, the balloons are spawned at random intervals.

   When the `spawnBalloon` the background script performs a series of checks before actually spawning a balloon.

   1. Is there a spawn timeout?
   2. Should there be a spawn timeout? if so, set the spawn timeout.
   3. Is the browser [idle](https://developer.chrome.com/docs/extensions/reference/api/idle)?
   4. Is there already a `spawnBalloon` alarm?

   If all checks pass, the background script will query all [active tabs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/query#active) and pick one to send the [spawn-balloon script](/src/content/spawn-balloon.ts) to.

2. `restart`: When this alarm goes off, [runtime.reload](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/reload) is called. This restarts the extension.

   A `restart` alarm is created when the remote server is not available or when any unexpected error occurs during setup. These alarms are created with a delay of one minute. This way, the extension will try to restart itself after a minute. Why a minute? Because the extension is not supposed to be restarted too often. If the remote server is not available, it probably also isn't available the next second, but maybe it is in one minute.

### Alarm Types

There is an `AlarmName` type in [const.ts](/src/const.ts) that defines the alarm names. This way, there is type safety and the alarm names are consistent throughout the extension.

## Messages

Pop-a-loon uses the [browser messaging API](https://developer.chrome.com/docs/extensions/develop/concepts/messaging) to communicate between different scripts.

These are the actions for the messages (see [message types](#message-types)):

1. `updateCounter`: When this message is received, the background script will update the counter in the browser action badge.
2. `incrementCount`: When this message is received, the background will send a request to the remote server with the popped balloo.
3. `setLogLevel`: When this message is received, the background script will set the log level specified in the message.

### Message Types

There are a few types defined in [const.ts](/src/const.ts) and exported under the `Message` type. They can be distinguished using the `Message.action` property.

## Important methods

The background script has a few important methods initalized:

- `setup()`: The setup function where all setups happen.
- `spawnBalloon()`: A balloon is sent to a tab.
- `createSpawnAlarm(name)`: Creates a balloon spawn alarm. Is triggered after `spawnBalloon()` was called.
- `backgroundScript()`: This is the 'main' function. This is the function that is initially called and calls the `setup()` function.

These include most of the functionallity of the background.

## Event listeners

The background also listens to some events.

- Alarms with [`onAlarm`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/alarms/onAlarm). See [alarms](#alarms).
- Messages with [`onMessage`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage). See [messages](#messages).
- [`onStartup`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onStartup)
- [`onInstalled`](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onInstalled)
