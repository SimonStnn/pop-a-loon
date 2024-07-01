import Default from './default';

export default class Gold extends Default {
  public static readonly spawn_chance: number = 1.05;
  // @ts-ignore
  public readonly name = 'gold';

  constructor() {
    super();
    this.options.imageUrl = `/../${this.name}/balloon.svg`;
    this.riseDurationThreshold[0] = 15000;
    this.riseDurationThreshold[1] = 20000;
    this.swingDurationThreshold[0] = 3;
    this.swingDurationThreshold[1] = 4;
  }
}
