export interface BeholdPost {
  id: string; caption?: string; prunedCaption?: string; permalink: string; timestamp: string;
  likeCount?: number; commentsCount?: number; mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl?: string; thumbnailUrl?: string;
  sizes?: { small?: { mediaUrl?: string }; medium?: { mediaUrl?: string }; large?: { mediaUrl?: string }; full?: { mediaUrl?: string } };
}

export function pickImageUrl(post: BeholdPost): string | null {
  return post.sizes?.medium?.mediaUrl || post.sizes?.large?.mediaUrl || post.thumbnailUrl || post.mediaUrl || null;
}
export function shortCaption(post: BeholdPost): string {
  const raw = (post.prunedCaption || post.caption || '').trim();
  return raw.length > 160 ? raw.slice(0, 157).trimEnd() + '…' : raw;
}
export function normalizePosts(posts: BeholdPost[]) {
  return posts.map(p => ({
    id: p.id, permalink: p.permalink, mediaType: p.mediaType, imageUrl: pickImageUrl(p), caption: shortCaption(p),
    timestamp: p.timestamp, likeCount: p.likeCount ?? 0, commentsCount: p.commentsCount ?? 0,
  })).filter(p => p.imageUrl && p.permalink);
}