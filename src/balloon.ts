import browser from 'webextension-polyfill';
import { getBalloonContainer, sendMessage } from '@/utils';
import { BalloonName } from './const';

/**
 * The location of the balloon resources. (`resources/balloons/`)
 */
export const balloonResourceLocation = browser.runtime.getURL(
  'resources/balloons/'
);
export const defaultBalloonFolderName = 'default';
/**
 * The location of the default balloon resources. (`resources/balloons/default/`)
 */
export const defaultBalloonResourceLocation =
  balloonResourceLocation + `${defaultBalloonFolderName}/`;

export default abstract class Balloon {
  public abstract readonly name: BalloonName;

  /**
   * Build a balloon element.
   *
   * This function creates a new balloon element and adds it to the balloon container.
   *
   * @param element The element to add to the balloon.
   * @param props The properties for the balloon element.
   * @returns The balloon element.
   */
  public abstract build(): void;

  public readonly element: HTMLDivElement = document.createElement('div');

  constructor() {
    // Add an event listener to the balloon
    this.element.addEventListener('click', this.pop.bind(this));
  }

  /**
   * @returns Whether the balloon is rising.
   */
  public isRising(): boolean {
    return this.element.style.animationName === 'rise';
  }

  /**
   * Make the balloon rise.
   *
   * This will create a new balloon element and add it to the balloon container.
   */
  public rise(): void {
    // Build the balloon element
    this.build();
    // Add the balloon to the container
    getBalloonContainer().appendChild(this.element);
  }

  /**
   * Remove the balloon.
   */
  public remove(): void {
    // loop until the parent node has 'balloon' class
    this.element.remove();
    this.element.style.animationName = 'none';
  }

  /**
   * Pop the balloon.
   *
   * This will be called after the balloon is removed and the pop sound is played.
   *
   * @param event The mouse event that triggered the pop.
   */
  public pop(event?: MouseEvent): void | Promise<void> {
    // Remove the balloon
    this.remove();

    // Send message with the new count
    sendMessage({ action: 'incrementCount', type: this.name });
  }
}
