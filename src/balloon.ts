import { generateRandomNumber, incrementBalloonCount } from "./utils";
import { balloonImageUrl,  } from "./const";

export const balloonContainer = document.createElement("div");
balloonContainer.id = "balloon-container";

export default class Balloon {
  element: HTMLDivElement = document.createElement("div");
  currentTopOffset: number = 100;
  duration: number;

  constructor() {
    // Set the balloon's width and height to value between 50 and 200
    this.element.classList.add("balloon");
    const size = generateRandomNumber(50, 75);
    this.element.style.width = size + "px";
    this.element.style.height = size + "px";
    this.element.style.left = `calc(${generateRandomNumber(5, 95) + "vw"} - ${
      size / 2
    }px)`;
    const image = document.createElement("img");
    image.src = balloonImageUrl;
    this.element.appendChild(image);

    // Add the balloon to the page
    balloonContainer.appendChild(this.element);

    this.duration = generateRandomNumber(10000, 15000);

    // Make the balloon rise
    this.rise();

    // Add an event listener to the balloon
    this.element.addEventListener("click", this.pop.bind(this));
  }

  rise() {
    this.element.style.animation = `rise ${this.duration}ms linear`;

    setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    this.element.remove();
  }

  pop() {
    console.log("Balloon popped!");
    this.remove();
    incrementBalloonCount();
  }
}
