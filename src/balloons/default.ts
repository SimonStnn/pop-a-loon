import Balloon from '@/balloon';

export default class Default extends Balloon {
  public static readonly spawn_chance = 0.9;
  public readonly options = { name: 'default' };

  public build(e, props) {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');

    // Set the balloon's width and height
    balloon.style.width = props.size + 'px';
    balloon.style.height = balloon.style.width;
    balloon.style.left = `calc(${props.positionX.toString() + 'vw'} - ${props.size / 2}px)`;
    balloon.style.animationDuration = props.riseDuration.toString() + 'ms';
    balloon.style.animationTimingFunction = 'linear';
    balloon.style.animationFillMode = 'forwards';
    balloon.style.animationName = 'rise';
    balloon.addEventListener('animationend', props.onAnimationend);

    // Create a second div and apply the swing animation to it
    const swingElement = document.createElement('div');
    swingElement.style.animation = `swing ${props.waveDuration}s infinite ease-in-out`;
    const waveElement = document.createElement('div');
    waveElement.style.animation = `wave ${props.waveDuration / 2}s infinite ease-in-out alternate`;
    // Start wave animation at -3/4 of the swing animation (makes sure the wave has started before the balloon comes on screen)
    waveElement.style.animationDelay = `-${(props.waveDuration * 3) / 4}s`;

    balloon.appendChild(swingElement);
    swingElement.appendChild(waveElement);
    waveElement.appendChild(element);

    return balloon;
  }
}
