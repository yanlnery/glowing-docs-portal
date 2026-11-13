import { describe, expect, test } from 'bun:test';
import { isHomeAnimalAvailable, needsUpcomingLitters, stretchesUpcomingLitters, hasAvailableAnimals, hasFreshInstagramPosts } from '../src/lib/homeConversion';
import { fetchWithCarouselRetry } from '../src/lib/carouselRetry';

describe('home conversion rules', () => {
  test('only available=true and disponivel are purchasable', () => {
    expect(isHomeAnimalAvailable({ available: true, status: 'disponivel' })).toBe(true);
    for (const status of ['vendido', 'indisponivel', undefined]) expect(isHomeAnimalAvailable({ available: true, status })).toBe(false);
    expect(isHomeAnimalAvailable({ available: false, status: 'disponivel' })).toBe(false);
    expect(hasAvailableAnimals([{ available: false, status: 'vendido' }])).toBe(false);
    expect(hasAvailableAnimals([{ available: true, status: 'disponivel' }])).toBe(true);
  });
  test('ninhadas fills grids below three and spans two columns only with one animal', () => {
    expect([0, 1, 2, 3].map(needsUpcomingLitters)).toEqual([true, true, true, false]);
    expect([0, 1, 2, 3].map(stretchesUpcomingLitters)).toEqual([false, true, false, false]);
  });
  test('Instagram freshness is at most 60 days and never future', () => {
    const now = Date.UTC(2026, 10, 13);
    const day = 86400000;
    expect(hasFreshInstagramPosts([{ timestamp: new Date(now - 60 * day).toISOString() }], now)).toBe(true);
    expect(hasFreshInstagramPosts([{ timestamp: new Date(now - 60 * day - 1).toISOString() }], now)).toBe(false);
    expect(hasFreshInstagramPosts([{ timestamp: new Date(now + 1).toISOString() }], now)).toBe(false);
    expect(hasFreshInstagramPosts([{ timestamp: 'invalid' }], now)).toBe(false);
    expect(hasFreshInstagramPosts([], now)).toBe(false);
  });
  test('carousel retries exactly once after failure', async () => {
    let calls = 0;
    expect(await fetchWithCarouselRetry(async () => { if (++calls === 1) throw new Error('temporary'); return ['slide']; })).toEqual(['slide']);
    expect(calls).toBe(2);
    calls = 0;
    await expect(fetchWithCarouselRetry(async () => { calls++; throw new Error('persistent'); })).rejects.toThrow('persistent');
    expect(calls).toBe(2);
  });
  test('successful empty carousel does not retry', async () => {
    let calls = 0;
    expect(await fetchWithCarouselRetry(async () => { calls++; return []; })).toEqual([]);
    expect(calls).toBe(1);
  });
});