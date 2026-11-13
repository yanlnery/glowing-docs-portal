/** One automatic retry, without changing successful or empty responses. */
export async function fetchWithCarouselRetry<T>(fetchItems: () => Promise<T>): Promise<T> {
  try { return await fetchItems(); } catch { return fetchItems(); }
}