import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { normalizePosts, pickImageUrl, shortCaption, type BeholdPost } from './feed.ts';

const post: BeholdPost = { id: '1', permalink: 'https://instagram.com/p/1', timestamp: '2026-11-13T00:00:00Z', mediaType: 'IMAGE', mediaUrl: 'original', thumbnailUrl: 'thumbnail', sizes: { medium: { mediaUrl: 'medium' }, large: { mediaUrl: 'large' } } };
Deno.test('prefer medium images', () => assertEquals(pickImageUrl(post), 'medium'));
Deno.test('captions are capped at 160 characters', () => assertEquals(shortCaption({ ...post, caption: 'a'.repeat(200) }).length, 158));
Deno.test('empty and unusable feeds cannot produce cache replacements', () => {
  assertEquals(normalizePosts([]), []);
  assertEquals(normalizePosts([{ ...post, permalink: '' }]), []);
});