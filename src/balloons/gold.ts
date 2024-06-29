import Default, { BalloonOptions } from './default';

export default class Confetti extends Default {
  public static readonly spawn_chance: number = 0.05;
  // @ts-ignore
  public readonly name = 'gold';

  public readonly riseDurationThreshold: [number, number] = [15000, 20000];

  constructor() {
    super();
    this.options.imageUrl = `/../${this.name}/balloon.svg`;
  }
}
