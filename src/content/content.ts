import Balloon, { balloonContainer } from '../balloon';
import { Message } from '../const';
import './style.css';

(() => {
  // Prevent multiple script loads
  if (
    document.body.id === 'pop-a-loon' ||
    document.body.contains(balloonContainer)
  ) {
    return;
  }

  chrome.runtime.onMessage.addListener(
    async (message: Message, sender, sendResponse) => {
      // Always call sendResponse, this is required
      sendResponse();
      // If the message is not spawnBalloon, ignore it
      if (message.action !== 'spawnBalloon') return;
      // Create a new balloon and make it rise
      const balloon = new Balloon();
      balloon.rise();
    }
  );

  document.body.appendChild(balloonContainer);
})();
