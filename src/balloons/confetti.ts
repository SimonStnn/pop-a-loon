import Balloon, { balloonResourceLocation } from '@/balloon';
import { random } from '@/utils';
import '@/../resources/balloons/confetti/confetti.css';

export default class Confetti extends Balloon {
  public readonly name = 'confetti';
  public static readonly spawn_chance = 0.15;

  private readonly mask = document.createElement('img');

  constructor() {
    super();

    this.element.appendChild(this.mask);
    this.mask.src = balloonResourceLocation + this.name + '/mask.png';
    this.mask.style.position = 'absolute';
    this.mask.style.top = '-10px';
    this.mask.style.left = '0';
    // Give it a random rotation
    this.mask.style.transform = `rotate(${Math.random() * 360}deg)`;
  }

  public pop(event?: MouseEvent) {
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
    throwConfetti(confetti, 100, 2000);
    // Remove the confetti after 2 seconds
    setTimeout(() => {
      confetti.remove();
    }, 2000);
  }
}

function throwConfetti(
  element: HTMLElement,
  amount: number = 100,
  duration: number = 2000
) {
  const df = document.createDocumentFragment();
  for (let i = 0; i < amount; i++) {
    const c = document.createElement('i');
    c.className = 'particle';
    const angle = random(360);
    const radius = random(250);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    c.style.cssText = `
        transform: translate3d(${x}px, ${y}px, 0)
        rotate(${angle}deg);
        background: hsla(${random(360)},100%,50%,1);
      `;
    df.appendChild(c);
    setTimeout(() => {
      c.remove();
    }, duration);
  }
  element.appendChild(df);
}
