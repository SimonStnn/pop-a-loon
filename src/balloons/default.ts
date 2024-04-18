import Balloon from '@/balloon';
import { generateRandomNumber } from '@/utils';

export default class Default extends Balloon {
  getRandomDuration() {
    return generateRandomNumber(10000, 15000);
  }
}
