import Balloon from '@/balloon';

export default class Default extends Balloon {
  public static readonly spawn_chance = 0.9;
  public readonly options = { name: 'default' };
}
