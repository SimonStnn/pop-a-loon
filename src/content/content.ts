function generateRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const balloonImageUrl = chrome.runtime.getURL("icons/icon.png");
const stylesheetUrl = chrome.runtime.getURL("src/content/style.css");

class Balloon {
  element: HTMLDivElement = document.createElement("div");
  currentTopOffset: number = 100;

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
    document.body.appendChild(this.element);

    // Make the balloon rise
    this.rise();

    // Add an event listener to the balloon
    this.element.addEventListener("click", this.pop.bind(this));
  }

  rise() {
    // Change this to make the balloon rise at a different speed
    const riseSpeed = generateRandomNumber(0.05, 0.2);
    const riseDelay = generateRandomNumber(10, 20);

    const riseInterval = setInterval(() => {
      // Get the current top position of the balloon

      if (this.currentTopOffset + this.element.clientHeight <= 0) {
        clearInterval(riseInterval);
        this.remove();
        return;
      }
      this.currentTopOffset -= riseSpeed;

      this.element.style.top = this.currentTopOffset.toString() + "vh";
    }, riseDelay);
  }

  remove() {
    console.log("Balloon removed!");

    this.element.remove();
  }

  pop() {
    this.remove();
  }
}

const stylesheet = document.createElement("link");
stylesheet.rel = "stylesheet";
stylesheet.type = "text/css";
stylesheet.href = stylesheetUrl;
document.head.appendChild(stylesheet);

const balloonInterval = setInterval(() => {
  const balloon = new Balloon();
  balloon.rise();
}, 100);
