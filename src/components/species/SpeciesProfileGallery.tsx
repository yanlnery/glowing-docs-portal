import { useState } from 'react';
import type { Species } from '@/types/species';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export function speciesImageUrl(src: string) {
  if (!src.includes('/storage/v1/')) return src;
  return `${src.split('?')[0].replace('/object/public/', '/render/image/public/')}?width=960&quality=95&format=webp&height=720`;
}

export function SpeciesProfileImage({ species, priority = false, photo = 1, src }: { species: Species; priority?: boolean; photo?: number; src?: string }) {
  const mobile = useIsMobile();
  return <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
    <OptimizedImage src={speciesImageUrl(src || species.image || '')}
      alt={`${species.commonname} (${species.name}) — foto ${photo}, criadouro Pet Serpentes`}
      priority={priority} disableTransform disableSrcSet disablePlaceholderBlur
      style={{ objectPosition: (mobile ? species.focus_mobile : species.focus_desktop) || 'center' }} />
  </div>;
}

export function SpeciesProfileGallery({ species }: { species: Species }) {
  const [index, setIndex] = useState(0);
  const images = [...new Set([species.image, ...(species.gallery || [])].filter((src): src is string => Boolean(src)))];
  const selected = images[index] || images[0];
  return <div className="min-w-0 space-y-3">
    <SpeciesProfileImage key={selected} species={species} src={selected} photo={index + 1} priority={index === 0} />
    {images.length > 1 && <div className="grid grid-cols-4 gap-2">
      {images.map((src, i) => <Button key={src} variant="ghost" className="block h-auto p-0" aria-label={`Ver foto ${i + 1}`} aria-pressed={i === index} onClick={() => setIndex(i)}>
        <SpeciesProfileImage species={species} src={src} photo={i + 1} />
      </Button>)}
    </div>}
  </div>;
}