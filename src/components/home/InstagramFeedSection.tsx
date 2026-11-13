import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Play, Images, Heart, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { hasFreshInstagramPosts } from "@/lib/homeConversion";

interface InstagramPost { id: string; permalink: string; mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"; imageUrl: string; caption: string; timestamp: string; likeCount: number; commentsCount: number }
interface InstagramProfile { username: string; followersCount: number | null; profilePictureUrl: string | null }
interface FeedCache { profile: InstagramProfile | null; posts: InstagramPost[] | null }

function formatFollowers(count: number | null | undefined): string | null {
  if (count == null) return null;
  if (count >= 1000) return `${(count / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil seguidores`;
  return `${count.toLocaleString("pt-BR")} seguidores`;
}
function formatCount(count: number): string {
  if (count >= 1000) return (count / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + " mil";
  return count.toLocaleString("pt-BR");
}
function postAlt(post: InstagramPost, username: string): string {
  const base = post.caption?.trim();
  if (base) return base.length > 80 ? base.slice(0, 77).trimEnd() + "…" : base;
  return `Post do Instagram @${username}`;
}
function TypeBadge({ mediaType }: { mediaType: InstagramPost["mediaType"] }) {
  if (mediaType === "IMAGE") return null;
  return <span className="absolute top-2 right-2 rounded-full bg-hero-scrim/60 p-1.5 text-hero-foreground">{mediaType === "VIDEO" ? <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" /> : <Images className="h-3.5 w-3.5" aria-hidden="true" />}</span>;
}
function PostCard({ post, username }: { post: InstagramPost; username: string }) {
  return (
    <a href={post.permalink} target="_blank" rel="noopener noreferrer" aria-label={`Ver post no Instagram: ${postAlt(post, username)}`} className="group relative block aspect-[4/5] overflow-hidden rounded-lg border hover:shadow-md transition-all">
      <img src={post.imageUrl} alt={postAlt(post, username)} loading="lazy" decoding="async" className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105" />
      <TypeBadge mediaType={post.mediaType} />
      <div className="absolute inset-0 hidden flex-col justify-end bg-hero-scrim/60 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
        <div className="flex items-center gap-4 text-hero-foreground text-sm font-medium">
          <span className="flex items-center gap-1.5"><Heart className="h-4 w-4 fill-current" aria-hidden="true" />{formatCount(post.likeCount)}</span>
          <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4 fill-current" aria-hidden="true" />{formatCount(post.commentsCount)}</span>
        </div>
        {post.caption && <p className="mt-2 text-xs text-hero-foreground/90 line-clamp-2">{post.caption}</p>}
      </div>
      <div className="instagram-mobile-scrim absolute inset-x-0 bottom-0 flex items-center gap-1.5 px-2 pb-1.5 pt-6 text-[11px] font-medium text-hero-foreground md:hidden"><Heart className="h-3 w-3 fill-current" aria-hidden="true" />{formatCount(post.likeCount)}</div>
    </a>
  );
}
function CardSkeleton() { return <Skeleton className="aspect-[4/5] w-full rounded-lg" />; }

export default function InstagramFeedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setIsNearViewport(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { setIsNearViewport(true); observer.disconnect(); }
    }, { rootMargin: "300px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["instagram-feed-cache"], enabled: isNearViewport, staleTime: 1000 * 60 * 60,
    queryFn: async (): Promise<FeedCache> => {
      const { data, error } = await supabase.from("instagram_feed_cache").select("profile, posts").eq("id", 1).maybeSingle();
      if (error) throw error;
      return { profile: (data?.profile as unknown as InstagramProfile | null) ?? null, posts: (data?.posts as unknown as InstagramPost[] | null) ?? null };
    },
  });
  const profile = data?.profile ?? null;
  const username = profile?.username ?? "petserpentes";
  const followers = formatFollowers(profile?.followersCount);
  const posts = (data?.posts ?? []).slice(0, 6);
  const showGrid = !isLoading && !isError && hasFreshInstagramPosts(posts);
  return (
    <section ref={sectionRef} className="py-16 bg-muted/20">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="mb-5 flex max-w-full flex-wrap justify-center items-center gap-2.5 rounded-full border bg-background px-4 py-2 shadow-sm">
            <span className="instagram-brand flex h-7 w-7 items-center justify-center rounded-full text-hero-foreground"><Instagram className="h-4 w-4" aria-hidden="true" /></span>
            <span className="text-sm font-semibold">@{username}</span>
            {followers && <span className="text-sm text-muted-foreground">· {followers}</span>}
          </div>
          <div className="docs-section-title"><h2 className="text-3xl font-bold">Direto do Criadouro</h2></div>
          <p className="text-muted-foreground max-w-2xl mt-4">Bastidores, nascimentos e o dia a dia dos nossos répteis — acompanhe no Instagram.</p>
        </div>
        {isLoading && isNearViewport && <>
          <div className="flex md:hidden overflow-x-auto gap-3 snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="flex-shrink-0 w-[44vw] snap-center"><CardSkeleton /></div>)}</div>
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-3">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
        </>}
        {showGrid && <>
          <div className="flex md:hidden overflow-x-auto gap-3 snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">{posts.map(post => <div key={post.id} className="flex-shrink-0 w-[44vw] snap-center"><PostCard post={post} username={username} /></div>)}</div>
          <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-3">{posts.map(post => <PostCard key={post.id} post={post} username={username} />)}</div>
        </>}
        <div className="mt-10 flex flex-col items-center gap-2 text-center">
          <Button size="lg" className="h-auto min-h-12 max-w-full whitespace-normal" asChild><a href="https://www.instagram.com/petserpentes/" target="_blank" rel="noopener noreferrer"><Instagram className="mr-2 h-5 w-5" aria-hidden="true" />Seguir @{username} no Instagram</a></Button>
          <p className="text-sm text-muted-foreground">Novos animais disponíveis aparecem primeiro por lá.</p>
        </div>
      </div>
    </section>
  );
}