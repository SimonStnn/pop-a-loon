import browser from 'webextension-polyfill';
import { BalloonName } from './const';
import {
  getBalloonContainer,
  importStylesheet,
  joinPaths,
  sendMessage,
} from '@/utils';

/**
 * The location of the balloon resources. (`resources/balloons/`)
 */
export const balloonResourceLocation = browser.runtime.getURL(
  joinPaths('resources', 'balloons')
);
export const defaultBalloonFolderName = 'default';
/**
 * The location of the default balloon resources. (`resources/balloons/default/`)
 */
export const defaultBalloonResourceLocation = joinPaths(
  balloonResourceLocation,
  defaultBalloonFolderName
);

type StyleSheetProps = {
  id?: string;
  name?: string;
};

export type PopOptions = {
  increaseCount?: boolean;
};

export const basePopOptions: PopOptions = {
  increaseCount: true,
};

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

  public get resourceLocation(): string {
    return joinPaths(balloonResourceLocation, this.name);
  }

  constructor() {
    // Add an event listener to the balloon
    this.element.addEventListener('click', this.pop.bind(this));
  }

  protected async importStylesheet(name?: string): Promise<void>;
  protected async importStylesheet({
    id,
    name,
  }: StyleSheetProps): Promise<void>;
  protected async importStylesheet(
    args?: string | StyleSheetProps
  ): Promise<void> {
    const { id, name } =
      typeof args === 'string' ? { id: undefined, name: args } : (args ?? {});
    await importStylesheet(
      `${id ?? this.name}-styles`,
      joinPaths(this.resourceLocation, name ?? 'styles.css')
    );
  }

  /**
   * @returns Whether the balloon is rising.
   */
  public isRising(): boolean {
    return this.element.style.animationName === 'rise';
  }

  public isRemoved(): boolean {
    return !getBalloonContainer().contains(this.element);
  }

  /**
   * Make the balloon rise.
   *
   * This will create a new balloon element and add it to the balloon container.
   */
  public rise(): void {
    // Import base styles
    importStylesheet(
      'balloon-styles',
      browser.runtime.getURL(
        joinPaths('resources', 'balloons', 'base-styles.css')
      )
    );
    // Set data attribute
    this.element.setAttribute('data-balloon', this.name);

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
  public pop(event?: MouseEvent, options?: PopOptions): void | Promise<void> {
    options = { ...basePopOptions, ...options };
    // Remove the balloon
    this.remove();

    if (options?.increaseCount) {
      // Send message with the new count
      sendMessage({ action: 'incrementCount', type: this.name });
    }
  }
}
