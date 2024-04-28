import fs from 'fs';
import path from 'path';
import * as balloons from '@/balloons';

test('all balloons are exported in the index file', () => {
  const files = fs.readdirSync(path.resolve(__dirname, '../src/balloons'));
  const balloonNames = files
    .map((file) => file.replace('.ts', ''))
    .filter((name) => name !== 'index');

  balloonNames.forEach((name) => {
    expect(balloons).toHaveProperty(name[0].toUpperCase() + name.slice(1));
  });
});
