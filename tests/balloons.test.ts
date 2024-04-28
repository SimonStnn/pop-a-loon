import fs from 'fs';
import path from 'path';
import Balloon from '@/balloon';
import * as balloons from '@/balloons';

describe('Balloons', () => {
  let balloonNames: string[];

  beforeEach(() => {
    const files = fs.readdirSync(path.resolve(__dirname, '../src/balloons'));
    balloonNames = files
      .map((file) => file.replace('.ts', ''))
      .filter((name) => name !== 'index');
  });

  test('all balloonNames are lower case', () => {
    balloonNames.forEach((name) => {
      expect(name).toBe(name.toLowerCase());
    });
  });

  test('all balloons are exported in the index file', () => {
    balloonNames.forEach((name) => {
      const balloonName = name[0].toUpperCase() + name.slice(1);
      expect(balloons).toHaveProperty(balloonName);

      const balloon = (balloons as { [key: string]: typeof Balloon })[
        balloonName
      ];
      expect(balloon.name).toBe(balloonName);
    });
  });

  test('all balloons have a corresponding test file', () => {
    balloonNames.forEach((name) => {
      const testName = `${name}.test.ts`;
      expect(fs.existsSync(path.resolve(__dirname, `./balloons/${testName}`)));
    });
  });

  test('each balloon has its resources under resources/balloons/{balloon.name}/...', () => {
    balloonNames.forEach((name) => {
      const balloonResourcePath = path.resolve(
        __dirname,
        `../resources/balloons/${name}`
      );
      expect(fs.existsSync(balloonResourcePath)).toBeTruthy();
    });
  });
});
