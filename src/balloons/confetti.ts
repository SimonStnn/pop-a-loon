import { balloonResourceLocation } from '@/balloon';
import { random } from '@/utils';
import Default from './default';

export default class Confetti extends Default {
  public static readonly spawn_chance: number = 0.1;
  // @ts-ignore
  public get name(): 'confetti' {
    return 'confetti';
  }

  private readonly mask = document.createElement('img');

  public build(): void {
    super.build();
    this.importStylesheet('confetti.css');

    this.element.firstChild?.firstChild?.appendChild(this.mask);
    this.mask.src = balloonResourceLocation + this.name + '/mask.png';
    this.mask.style.position = 'absolute';
    this.mask.style.top = '-10px';
    this.mask.style.left = '0';
    // Give it a random rotation
    this.mask.style.transform = `rotate(${Math.random() * 360}deg)`;
  }

  public async pop(event: MouseEvent) {
    super.pop(event);
    // Get the click position
    const x = event?.clientX || window.innerWidth / 2;
    const y = event?.clientY || window.innerHeight / 2;
    // Add an element to that position
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.top = `${y}px`;
    confetti.style.left = `${x}px`;
    confetti.style.zIndex = '1000';
    confetti.style.pointerEvents = 'none';
    document.body.appendChild(confetti);
    // Throw confetti
    throwConfetti(confetti, 100);
    // Remove the confetti after 2 seconds
    setTimeout(() => {
      confetti.remove();
    }, 2000);
  }
}

function throwConfetti(element: HTMLElement, amount: number = 100) {
  const df = document.createDocumentFragment();
  const offset = 10;
  const particles: HTMLElement[] = [];
  for (let i = 0; i < amount; i++) {
    const c = document.createElement('i');
    c.className = 'particle';
    const angle = random(360);
    const radius = random(250);
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);
    c.style.cssText = `
        transform: translate3d(${x}px, ${y}px, 0)
        rotate(${angle}deg);
        background: hsla(${random(360)},100%,50%,1);
      `;
    df.appendChild(c);
    particles.push(c);
  }
  element.appendChild(df);

  function checkBounds() {
    particles.forEach((particle, index) => {
      const rect = particle.getBoundingClientRect();
      if (
        rect.bottom < +offset ||
        rect.top > window.innerHeight - offset ||
        rect.left > window.innerWidth - offset ||
        rect.right < +offset
      ) {
        particle.remove();
        particles.splice(index, 1);
      }
    });
    if (particles.length > 0) {
      requestAnimationFrame(checkBounds);
    }
  }
  requestAnimationFrame(checkBounds);
}
