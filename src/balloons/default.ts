import Balloon from '@/balloon';
import { generateRandomNumber } from '@/utils';

export default class Default extends Balloon {
  public readonly name = 'default';
  public static readonly spawn_chance = 0.95;
}
