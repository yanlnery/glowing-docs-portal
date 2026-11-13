export const HOME_WHATSAPP_URL = `https://wa.me/5521967802174?text=${encodeURIComponent("Olá! Vim pelo site da Pet Serpentes e quero saber sobre os animais disponíveis.")}`;

export function isHomeAnimalAvailable(animal: { available: boolean; status?: string }): boolean {
  return animal.available === true && animal.status === "disponivel";
}

export function needsUpcomingLitters(availableCount: number): boolean {
  return availableCount < 3;
}

export function stretchesUpcomingLitters(availableCount: number): boolean {
  return availableCount === 1;
}

export function hasAvailableAnimals(animals: { available: boolean; status?: string }[]): boolean {
  return animals.some(isHomeAnimalAvailable);
}

export function hasFreshInstagramPosts(posts: { timestamp: string }[], now = Date.now()): boolean {
  const timestamps = posts.map(post => Date.parse(post.timestamp)).filter(Number.isFinite);
  if (!timestamps.length) return false;
  const newest = Math.max(...timestamps);
  return newest <= now && now - newest <= 60 * 24 * 60 * 60 * 1000;
}