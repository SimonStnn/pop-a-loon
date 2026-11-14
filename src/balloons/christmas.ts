import Default, { BalloonOptions } from './default';
import { random } from '@/utils';
import type { Season } from '@/balloon';

const SNOW_PARTICLE_COUNT = 72;
const SNOW_DURATION_MS = 5000;
const SNOWFLAKE_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M12 2v20M3.34 7l17.32 10M3.34 17l17.32-10M12 2 9.5 5M12 2l2.5 3m-2.5 14-2.5-3m2.5 3 2.5-3M3.34 7l4 .2M3.34 7l1.5 3.6m13.82 2.6 1.5 3.6m-1.5-3.6 4-.2M3.34 17l4-.2m-4 .2 1.5-3.6m13.82-2.6 1.5-3.6m-1.5 3.6 4 .2"/></g></svg>';

export default class Christmas extends Default {
  public static readonly spawn_chance: number = 0.3;
  public static readonly season: Season = {
    start: { month: 11, day: 15 },
    end: { month: 12, day: 30 },
    timeZone: 'Europe/Brussels',
  };

  // @ts-ignore
  public get name(): 'christmas' {
    return 'christmas';
  }

  public get options(): BalloonOptions {
    return {
      ...super.options,
      imageUrl: 'balloon.svg',
      popSoundUrl: 'pop.mp3',
    };
  }

  public build(): void {
    super.build();
    this.importStylesheet('christmas.css');
  }

  public async pop(event: MouseEvent): Promise<void> {
    super.pop(event);
    this.createSnow(event);
  }

  private createSnow(event?: MouseEvent): void {
    const snow = document.createElement('div');
    snow.className = 'christmas-snow';
    snow.setAttribute('aria-hidden', 'true');
    const originX = event?.clientX ?? window.innerWidth / 2;
    const originY = event?.clientY ?? window.innerHeight / 2;
    snow.style.left = `${originX}px`;
    snow.style.top = `${originY}px`;

    const particles = document.createDocumentFragment();
    for (let index = 0; index < SNOW_PARTICLE_COUNT; index += 1) {
      const particle = document.createElement('i');
      particle.className = 'christmas-snowflake';
      const angle = random(0, Math.PI * 2);
      const distance = Math.sqrt(Math.random()) * random(70, 220);
      const burstX = Math.cos(angle) * distance;
      const burstY = Math.sin(angle) * distance;
      const fallX = burstX + random(-70, 70);
      const fallY = window.innerHeight - originY + random(20, 80);
      particle.style.setProperty('--snow-size', `${random(8, 15)}px`);
      particle.style.setProperty('--snow-burst-x', `${burstX}px`);
      particle.style.setProperty('--snow-burst-y', `${burstY}px`);
      particle.style.setProperty('--snow-fall-x', `${fallX}px`);
      particle.style.setProperty('--snow-fall-y', `${fallY}px`);
      particle.style.setProperty('--snow-rotation', `${random(-540, 540)}deg`);
      particle.style.setProperty(
        '--snow-duration',
        `${random(3500, SNOW_DURATION_MS)}ms`
      );
      particle.innerHTML = SNOWFLAKE_SVG;
      particles.appendChild(particle);
    }

    snow.appendChild(particles);
    document.body.appendChild(snow);
    window.setTimeout(() => snow.remove(), SNOW_DURATION_MS + 300);
  }
}
