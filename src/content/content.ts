import Balloon, { balloonContainer } from "../balloon";
import { generateRandomNumber, minutesToMilliseconds } from "../utils";
import "./style.css";

document.body.appendChild(balloonContainer);

const generateRandomInterval = () =>
  generateRandomNumber(minutesToMilliseconds(5), minutesToMilliseconds(10));

let balloonInterval = setTimeout(function createAndRiseBalloon() {
  const balloon = new Balloon();
  balloon.rise();

  // Set the next interval
  clearInterval(balloonInterval);
  balloonInterval = setTimeout(createAndRiseBalloon, generateRandomInterval());
}, generateRandomInterval());
