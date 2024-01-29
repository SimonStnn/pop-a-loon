import Balloon, { balloonContainer } from "../balloon";
import "./style.css";

document.body.appendChild(balloonContainer);

const balloonInterval = setInterval(() => {
  const balloon = new Balloon();
  balloon.rise();
}, 6000);
