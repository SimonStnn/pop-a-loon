import fs from 'fs';
import path from 'path';
import Balloon from '@/balloon';
import * as balloons from '@/balloons';

test('all balloons are exported in the index file', () => {
  const files = fs.readdirSync(path.resolve(__dirname, '../src/balloons'));
  const balloonNames = files
    .map((file) => file.replace('.ts', ''))
    .filter((name) => name !== 'index');

  balloonNames.forEach((name) => {
    const balloonName = name[0].toUpperCase() + name.slice(1);
    expect(balloons).toHaveProperty(balloonName);

    const balloon = (balloons as { [key: string]: typeof Balloon })[
      balloonName
    ];
    expect(balloon.name).toBe(balloonName);
  });
});
