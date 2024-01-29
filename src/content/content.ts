import Balloon, { balloonContainer } from "../balloon";
import { generateRandomNumber } from "../utils";
import "./style.css";

document.body.appendChild(balloonContainer);

const generateRandomInterval = () => generateRandomNumber(3000, 6000);

let balloonInterval = setTimeout(function createAndRiseBalloon() {
  const balloon = new Balloon();
  balloon.rise();

  // Set the next interval
  clearInterval(balloonInterval);
  balloonInterval = setTimeout(createAndRiseBalloon, generateRandomInterval());
}, generateRandomInterval());