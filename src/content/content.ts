import Balloon, { balloonContainer } from "../balloon";
import { generateRandomNumber, minutesToMilliseconds } from "../utils";
import "./style.css";

(() => {
  // Prevent multiple script loads
  if (
    document.body.id === "pop-a-loon" ||
    document.body.contains(balloonContainer)
  ) {
    return;
  }

  document.body.appendChild(balloonContainer);

  const generateRandomInterval = () => generateRandomNumber(1000, 2000);

  let balloonInterval = setTimeout(function createAndRiseBalloon() {
    const balloon = new Balloon();
    balloon.rise();

    // Set the next interval
    clearInterval(balloonInterval);
    balloonInterval = setTimeout(
      createAndRiseBalloon,
      generateRandomInterval()
    );
  }, generateRandomInterval());
})();
