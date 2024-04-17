import browser from 'webextension-polyfill';

import { generateRandomNumber } from '@/utils';
import Balloon from '@/balloon';

export default class Default extends Balloon {
  protected balloonImageUrl = browser.runtime.getURL(
    'resources/icons/icon-128.png'
  );
  protected popSound = new Audio(
    browser.runtime.getURL('resources/audio/pop.mp3')
  );

  getRandomDuration() {
    return generateRandomNumber(10000, 15000);
  }
}
