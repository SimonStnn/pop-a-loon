import { generateRandomNumber, sendMessage } from '@utils';

export const balloonContainer = document.createElement('div');
balloonContainer.id = 'balloon-container';

const buildBalloonElement = (
  element: HTMLDivElement,
  props: {
    balloonImageUrl: string;
    size: number;
    positionX: number;
    riseDuration: number;
    onAnimationend: () => void;
  }
) => {
  element.classList.add('balloon');

  // Add an image to the balloon
  const image = document.createElement('img');
  image.src = props.balloonImageUrl;
  element.appendChild(image);

  // Set the balloon's width and height
  element.style.width = props.size + 'px';
  element.style.height = element.style.width;
  element.style.left = `calc(${props.positionX.toString() + 'vw'} - ${props.size / 2}px)`;
  element.style.animationDuration = props.riseDuration.toString() + 'ms';
  element.style.animationTimingFunction = 'linear';
  element.style.animationName = 'rise';
  element.addEventListener('animationend', props.onAnimationend);

  return element;
};

export default abstract class Balloon {
  protected abstract balloonImageUrl: string;
  protected abstract popSound: HTMLAudioElement;
  public abstract getRandomDuration(): number;

  private element: HTMLDivElement;

  constructor() {
    this.element = document.createElement('div');
    // Add an event listener to the balloon
    this.element.addEventListener('click', this.pop.bind(this));
  }

  public isRising() {
    return this.element.style.animationName === 'rise';
  }

  public rise() {
    // Build the balloon element
    buildBalloonElement(this.element, {
      size: generateRandomNumber(50, 75),
      balloonImageUrl: this.balloonImageUrl,
      positionX: generateRandomNumber(5, 95),
      riseDuration: this.getRandomDuration(),
      onAnimationend: this.remove.bind(this),
    });
    // Add the balloon to the container
    balloonContainer.appendChild(this.element);
  }

  public remove() {
    this.element.remove();
  }

  public async pop() {
    // Remove the balloon
    this.remove();
    // Play the pop sound
    this.popSound.play();

    // Send message with the new count
    sendMessage({ action: 'incrementCount' });
  }
}
