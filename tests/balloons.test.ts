import fs from 'fs';
import path from 'path';
import fetchMock from 'jest-fetch-mock';
import Balloon from '@/balloon';
import * as balloons from '@/balloons';

fetchMock.enableMocks();

const balloonName = (name: string): keyof typeof balloons =>
  (name[0].toUpperCase() + name.slice(1)) as keyof typeof balloons;

describe('Balloons', () => {
  let balloonNames: string[];

  beforeEach(() => {
    const files = fs.readdirSync(path.resolve(__dirname, '../src/balloons'));
    balloonNames = files
      .map((file) => file.replace('.ts', ''))
      .filter((name) => name !== 'index');

    fetchMock.resetMocks();
  });

  test('all balloonNames are lower case', () => {
    balloonNames.forEach((name) => {
      expect(name).toBe(name.toLowerCase());
    });
  });

  test('all balloons are exported in the index file', () => {
    balloonNames.forEach((name) => {
      expect(balloons).toHaveProperty(balloonName(name));
    });
  });

  test('all balloons extend the Balloon class', () => {
    balloonNames.forEach((name) => {
      const BalloonClass = balloons[balloonName(name)];
      expect(BalloonClass.prototype instanceof Balloon).toBeTruthy();
    });
  });

  test("all balloons' names are unique", () => {
    const uniqueNames = new Set(balloonNames);
    expect(uniqueNames.size).toBe(balloonNames.length);
  });

  test("all balloons' names are valid", () => {
    balloonNames.forEach((name) => {
      expect(name).toMatch(/^[a-z]+$/);
    });
  });

  test('all balloons have static spawn_chance property', () => {
    balloonNames.forEach((name) => {
      const BalloonClass = balloons[balloonName(name)];
      expect(BalloonClass).toHaveProperty('spawn_chance');
    });
  });

  test("all balloons' spawn_chance is a number between 0 and 1", () => {
    balloonNames.forEach((name) => {
      const BalloonClass = balloons[balloonName(name)];
      expect(BalloonClass.spawn_chance).toBeGreaterThanOrEqual(0);
      expect(BalloonClass.spawn_chance).toBeLessThanOrEqual(1);
    });
  });

  test('all balloons have a corresponding test file', () => {
    balloonNames.forEach((name) => {
      const testName = `${name}.test.ts`;
      expect(fs.existsSync(path.resolve(__dirname, `./balloons/${testName}`)));
    });
  });

  test('all balloons should have valid resource paths', () => {
    balloonNames.forEach((name) => {
      fetchMock.mockResponse(() => Promise.resolve(''));
      const balloon = new balloons[balloonName(name)]();

      const iconPath = path.resolve(__dirname, balloon.balloonImageUrl);
      const popPath = path.resolve(__dirname, balloon.popSoundUrl);
      expect(fs.existsSync(iconPath)).toBeTruthy();
      expect(fs.existsSync(popPath)).toBeTruthy();
    });
  });
});
