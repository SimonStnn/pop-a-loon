# Content scripts

## spawn-balloon

This script is sent to a tab and will spawn a balloon.

It will add a [balloon container](#balloon-container) to the page if its not already in the page. After this it will gather all balloon types and their spawn chances and pick a random balloon to spawn.

### Balloon container

This is div element added directly to the body of the page a balloon is sent to. All other page modifications happen in this element.
