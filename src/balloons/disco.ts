import Default, { BalloonOptions } from './default';
import { random } from '@/utils';

export default class Disco extends Default {
  public static readonly spawn_chance: number = 0.01;
  // @ts-ignore
  public get name(): 'disco' {
    return 'disco';
  }

  public get options(): BalloonOptions {
    return {
      ...super.options,
      imageUrl: 'balloon.svg',
      popSoundUrl: 'pop.mp3',
      riseDuration: [12000, 16000],
      swingDuration: [2, 3],
      swingOffset: 20,
    };
  }

  public readonly glowElement = document.createElement('div');

  public build(): void {
    super.build();
    this.importStylesheet('disco.css');
    this.swingElement.appendChild(this.glowElement);

    this.glowElement.className = 'glow';

    // Set custom properties for animations - using optimized ranges for best performance/visual effect balance
    this.glowElement.style.setProperty('--ray-length', `${random(250, 350)}%`); // in % relative to the balloon size
    this.glowElement.style.setProperty('--rotation-speed', `${random(9, 12)}s`); // Slightly slower rotation is more efficient
    this.glowElement.style.setProperty('--glow-speed', `${random(4, 6)}s`); // Slightly slower color changes
    this.glowElement.style.setProperty('--pulse-speed', `${random(2, 4)}s`); // More moderate pulse speed
  }
}
