import Balloon, { defaultBalloonFolderName } from '@/balloon';

export default class Default extends Balloon {
  public readonly name = defaultBalloonFolderName;
  public static readonly spawn_chance = 0.95;
}
