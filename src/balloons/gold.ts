import Default, { BalloonOptions } from './default';

export default class Confetti extends Default {
  public static readonly spawn_chance: number = 10.1;
  // @ts-ignore
  public readonly name = 'gold';

  constructor() {
    super();
    this.options.imageUrl = `/../${this.name}/balloon.svg`;
  }
}
