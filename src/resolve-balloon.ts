import * as balloons from '@/balloons';

type BalloonClass = (typeof balloons)[keyof typeof balloons];

const balloonClasses = balloons as Record<string, unknown>;

/**
 * Resolve a lowercase balloon name from the backend to its extension class.
 *
 * Balloon names are defined as the lowercase class name (see `Default`), while
 * the index exports the classes with a capitalized name.
 */
export function getBalloonClass(balloonName: string): BalloonClass | undefined {
  const className = balloonName.charAt(0).toUpperCase() + balloonName.slice(1);
  const BalloonClass = balloonClasses[className];
  return typeof BalloonClass === 'function'
    ? (BalloonClass as BalloonClass)
    : undefined;
}
