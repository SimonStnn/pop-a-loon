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
