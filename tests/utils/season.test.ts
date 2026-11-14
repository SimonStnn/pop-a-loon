import { isInSeason } from '@/utils';

describe('isInSeason', () => {
  const season = {
    start: { month: 11, day: 15 },
    end: { month: 12, day: 30 },
    timeZone: 'UTC',
  };
  test.each([
    ['2026-11-14', false],
    ['2026-11-15', true],
    ['2026-11-16', true],
    ['2026-11-30', true],
    ['2026-12-01', true],
    ['2026-12-25', true],
    ['2026-12-30', true],
    ['2026-12-31', false],
    ['2026-01-01', false],
    ['2026-02-01', false],
    ['2026-10-31', false],
  ])('returns %s for %s', (date, expected) => {
    expect(isInSeason(season, new Date(`${date}T12:00:00Z`))).toBe(expected);
  });
});
