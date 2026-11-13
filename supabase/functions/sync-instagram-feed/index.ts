import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';
import { normalizePosts, type BeholdPost } from './feed.ts';

const BEHOLD_FEED_URL = 'https://feeds.behold.so/7T0XSU59VbVccZ0AT4sF';
const MIN_INTERVAL_MINUTES = 30;
const BodySchema = z.object({ force: z.boolean().optional() }).strict();
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status,
});

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!url || !serviceKey || !anonKey) throw new Error('Missing Supabase configuration');
    const supabase = createClient(url, serviceKey);
    const rawBody = await req.text();
    let body: unknown;
    try { body = rawBody.trim() ? JSON.parse(rawBody) : {}; } catch { return json({ error: 'Invalid JSON' }, 400); }
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);
    const force = parsed.data.force === true;
    if (req.headers.get('apikey') !== anonKey) return json({ error: 'Invalid project key' }, 401);
    const { data: existing, error: cacheError } = await supabase.from('instagram_feed_cache').select('fetched_at').eq('id', 1).maybeSingle();
    if (cacheError) throw cacheError;
    // Bootstrap an empty cache with the project key; overriding an existing cache requires an admin JWT.
    if (force && existing?.fetched_at) {
      const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
      if (!token) return json({ error: 'Authentication required' }, 401);
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) return json({ error: 'Invalid authentication' }, 401);
      const { data: admin, error: roleError } = await supabase.rpc('is_admin', { _user_id: data.user.id });
      if (roleError || !admin) return json({ error: 'Admin access required' }, 403);
    }
    if (!force && existing?.fetched_at) {
      const ageMinutes = (Date.now() - new Date(existing.fetched_at).getTime()) / 60000;
      if (ageMinutes < MIN_INTERVAL_MINUTES) return json({ skipped: true, reason: 'cache_fresh', ageMinutes: Math.round(ageMinutes) });
    }
    const res = await fetch(BEHOLD_FEED_URL, { headers: { 'User-Agent': 'petserpentes-feed-sync/1.0' }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`Behold responded with ${res.status}`);
    const feed = await res.json();
    if (!Array.isArray(feed?.posts) || feed.posts.length === 0) throw new Error('Behold feed has no posts — keeping previous cache');
    const posts = normalizePosts(feed.posts as BeholdPost[]);
    if (posts.length === 0) throw new Error('No usable posts after normalization — keeping previous cache');
    const profile = { username: feed.username ?? 'petserpentes', followersCount: feed.followersCount ?? null, profilePictureUrl: feed.profilePictureUrl ?? null };
    const fetchedAt = new Date().toISOString();
    const { error: upsertError } = await supabase.from('instagram_feed_cache').upsert({ id: 1, profile, posts, fetched_at: fetchedAt });
    if (upsertError) throw upsertError;
    return json({ ok: true, postsCount: posts.length, fetchedAt });
  } catch (err) {
    console.error('sync-instagram-feed failed:', err);
    return json({ ok: false, error: String(err), cachePreserved: true }, 500);
  }
});