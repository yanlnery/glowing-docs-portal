import { Fragment } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SEO } from '@/components/SEO';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { fetchSpeciesDataFromDb } from '@/services/internal/speciesDb';
import { productService } from '@/services/productService';
import { isHomeAnimalAvailable } from '@/lib/homeConversion';
import { resolveSpeciesRoute, speciesGroups, speciesPath, type SpeciesGroup } from '@/lib/speciesGroups';
import { buildSpeciesFaq, characteristicValue, fixedSpeciesFaq, speciesDescription, truncateDescription, venomAnswer, type SpeciesFaq } from '@/lib/speciesProfile';
import { SpeciesProfileGallery } from '@/components/species/SpeciesProfileGallery';
import { SpeciesFaqSection, SpeciesFacts, SpeciesProfileActions, SpeciesProfileCards, SpeciesResponsibility } from '@/components/species/SpeciesProfileSections';
import { getYoutubeId } from '@/components/species/SpeciesDetailPanel';
import type { Species } from '@/types/species';
import NotFound from './NotFound';

const BASE = 'https://petserpentes.com.br';
const types = { serpente: 'Serpente', lagarto: 'Lagarto', quelonio: 'Quelônio', outro: 'Outro' };
type Crumb = { name: string; path: string };

function Breadcrumb({ items }: { items: Crumb[] }) {
  return <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground"><ol className="flex flex-wrap items-center gap-x-2 gap-y-1">{items.map((item, index) => <Fragment key={item.path}>
    {index > 0 && <li aria-hidden="true">›</li>}<li><Link to={item.path} aria-current={index === items.length - 1 ? 'page' : undefined} className="hover:text-primary">{item.name}</Link></li>
  </Fragment>)}</ol></nav>;
}

function PageSeo({ title, description, path, crumbs, faq, species }: { title: string; description: string; path: string; crumbs: Crumb[]; faq: SpeciesFaq[]; species?: Species }) {
  const youtubeId = species?.video_url ? getYoutubeId(species.video_url) : null;
  const schemas: Record<string, unknown>[] = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${BASE}${item.path}` })) },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  ];
  if (youtubeId && species) schemas.push({
    '@context': 'https://schema.org', '@type': 'VideoObject', name: `${species.commonname} — Pet Serpentes`,
    description: truncateDescription(species.description || `Vídeo sobre ${species.commonname} (${species.name}).`, 300),
    thumbnailUrl: species.image || undefined, uploadDate: species.updated_at || species.created_at || undefined,
    embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
  });
  return <SEO title={title} description={description} canonical={path} ogImage={species?.image && /^https?:\/\//.test(species.image) ? species.image : undefined} jsonLd={schemas} jsonLdKey="species-profile" />;
}

function GroupComparison({ species }: { species: Species[] }) {
  const labels = ['Tamanho', 'Temperamento', 'Bioma de Origem'];
  return <section><h2 className="docs-section-title text-2xl font-bold">Compare as espécies</h2>
    <table className="hidden w-full table-fixed text-left md:table">
      <thead><tr className="border-b border-border">{['Espécie', 'Nome científico', ...labels].map(label => <th key={label} className="p-3 align-top">{label}</th>)}</tr></thead>
      <tbody>{species.map(item => <tr key={item.id} className="border-b border-border"><td className="break-words p-3 align-top"><Link to={speciesPath(item)} className="text-primary underline">{item.commonname}</Link></td><td className="break-words p-3 align-top italic">{item.name}</td>{labels.map(label => <td key={label} className="break-words p-3 align-top text-muted-foreground">{characteristicValue(item.characteristics, label) || '—'}</td>)}</tr>)}</tbody>
    </table>
    <div className="space-y-4 md:hidden">{species.map(item => <div key={item.id} className="rounded-lg border border-border p-4"><h3 className="font-semibold"><Link to={speciesPath(item)} className="text-primary underline">{item.commonname}</Link></h3><p className="mt-1 text-sm italic text-muted-foreground">{item.name}</p><SpeciesFacts items={labels.map(label => `${label}: ${characteristicValue(item.characteristics, label) || '—'}`)} /></div>)}</div>
  </section>;
}

function ProfileSkeleton() {
  return <div className="container px-4 py-8" role="status" aria-label="Carregando ficha da espécie"><div className="mb-6 h-5 w-2/3 rounded bg-muted" /><div className="mb-4 h-12 w-3/4 rounded bg-muted" /><div className="grid gap-6 md:grid-cols-2"><div className="aspect-[4/3] rounded-lg bg-muted" /><div className="space-y-4"><div className="h-8 rounded bg-muted" /><div className="h-24 rounded bg-muted" /></div></div></div>;
}

export default function SpeciesProfile() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { data: list = [], isLoading, isError } = useQuery({
    queryKey: ['species-profiles'],
    queryFn: async () => { const result = await fetchSpeciesDataFromDb(); if (result.error) throw result.error; return result.data || []; },
  });
  const productsQuery = useQuery({ queryKey: ['species-profile-products'], queryFn: productService.getAvailableProducts });
  const { species, group, redirect } = resolveSpeciesRoute(list, slug);
  const manualQuery = useQuery({
    queryKey: ['species-profile-manual', species?.id], enabled: Boolean(species),
    queryFn: async () => {
      if (!species) return null;
      const { data, error } = await supabase.from('manuals').select('id,title').eq('species_id', species.id).limit(1);
      if (error) throw error;
      return data?.[0] || null;
    },
  });
  if (isLoading || productsQuery.isLoading) return <ProfileSkeleton />;
  if (isError || productsQuery.isError) return <div className="container px-4 py-12"><p className="mb-4 text-lg">Não foi possível carregar esta página agora. Tente novamente em instantes.</p><Button variant="outline" asChild><Link to="/especies">Ver espécies criadas</Link></Button></div>;
  if (redirect) return <Navigate to={redirect} replace />;
  if (!species && !group) return <><SEO title="Página não encontrada | Pet Serpentes" description="A página procurada não foi encontrada." canonical={`/especies-criadas/${slug}`} noindex /><NotFound /></>;
  const members = species ? [species] : list.filter(item => group?.filter(item));
  const memberIds = new Set(members.map(item => item.id));
  const available = (productsQuery.data || []).filter(product => product.speciesId && memberIds.has(product.speciesId) && isHomeAnimalAvailable(product));
  if (group) return <GroupProfile group={group} members={members} products={available} />;
  if (!species) return null;
  const parent = speciesGroups.find(group => group.filter(species));
  const path = speciesPath(species);
  const crumbs = [{ name: 'Início', path: '/' }, { name: 'Espécies Criadas', path: '/especies' }, ...(parent ? [{ name: parent.title, path: `/especies-criadas/${parent.slug}` }] : []), { name: species.commonname, path }];
  const faq = buildSpeciesFaq(species);
  const youtubeId = species.video_url ? getYoutubeId(species.video_url) : null;
  const others = list.filter(item => item.id !== species.id).sort((a, b) => Number(b.type === species.type) - Number(a.type === species.type)).slice(0, 6);
  return <>
    <PageSeo title={`${species.commonname} (${species.name}): tamanho, cuidados e filhotes | Pet Serpentes`} description={speciesDescription(species)} path={path} crumbs={crumbs} faq={faq} species={species} />
    <article className="container min-w-0 px-4 py-6 sm:py-10">
      <Breadcrumb items={crumbs} />
      <div className="mb-6"><h1 className="docs-section-title text-3xl font-bold leading-tight break-words">{species.commonname}</h1><p className="mb-3 text-lg italic text-muted-foreground">{species.name}</p><Badge variant="secondary">{types[species.type] || species.type}</Badge></div>
      <div className="grid min-w-0 gap-6 md:grid-cols-2 md:items-start">
        <SpeciesProfileGallery key={species.id} species={species} />
        <div className="min-w-0"><SpeciesProfileActions products={available} species={species} name={species.commonname} /></div>
      </div>
      <div className="mt-10 space-y-10">
        {parent && <Link to={`/especies-criadas/${parent.slug}`} className="inline-block text-primary underline underline-offset-4">{parent.compareLabel}</Link>}
        {species.description && <section><h2 className="docs-section-title text-2xl font-bold">Sobre {species.commonname}</h2><div className="space-y-4 text-muted-foreground leading-relaxed">{species.description.split(/\r?\n/).filter(p => p.trim()).map((p, index) => <p key={index}>{p}</p>)}</div></section>}
        {species.characteristics?.some(Boolean) && <section><h2 className="docs-section-title text-2xl font-bold">Ficha técnica: {species.commonname}</h2><SpeciesFacts items={species.characteristics} /></section>}
        {species.curiosities?.some(Boolean) && <section><h2 className="docs-section-title text-2xl font-bold">Curiosidades</h2><SpeciesFacts items={species.curiosities} /></section>}
        {youtubeId && <section><h2 className="docs-section-title text-2xl font-bold">Vídeo</h2><div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border"><iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube.com/embed/${youtubeId}`} title={`Vídeo sobre ${species.commonname}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" /></div></section>}
        {manualQuery.data && <section><h2 className="docs-section-title text-2xl font-bold">Manual de criação</h2><Link to="/manuais" className="block rounded-lg border border-border p-5 hover:bg-muted"><h3 className="font-semibold">Manual de criação: {species.commonname}</h3><p className="mt-2 text-sm text-muted-foreground">{manualQuery.data.title}</p></Link></section>}
        <SpeciesFaqSection items={faq} />
        <SpeciesResponsibility />
        <section><h2 className="docs-section-title text-2xl font-bold">Outras espécies que criamos</h2><SpeciesProfileCards species={others} /><Link to="/especies" className="mt-6 inline-block text-primary underline">Ver todas as espécies</Link></section>
      </div>
    </article>
  </>;
}

function GroupProfile({ group, members, products }: { group: SpeciesGroup; members: Species[]; products: import('@/types/product').Product[] }) {
  const path = `/especies-criadas/${group.slug}`;
  const crumbs = [{ name: 'Início', path: '/' }, { name: 'Espécies Criadas', path: '/especies' }, { name: group.title, path }];
  const faq = [...fixedSpeciesFaq, { question: `${group.slug === 'jiboia' ? 'Jiboia' : 'Jiboia arco-íris'} é venenosa?`, answer: venomAnswer }];
  return <>
    <PageSeo title={`${group.title}: espécies, tamanho e cuidados | Pet Serpentes`} description={truncateDescription(group.introduction)} path={path} crumbs={crumbs} faq={faq} />
    <article className="container min-w-0 px-4 py-6 sm:py-10"><Breadcrumb items={crumbs} /><h1 className="docs-section-title text-3xl font-bold leading-tight">{group.title}</h1><p className="max-w-4xl text-muted-foreground leading-relaxed">{group.introduction}</p>
      <div className="mt-8 space-y-10"><GroupComparison species={members} /><SpeciesProfileCards species={members} /><SpeciesProfileActions products={products} name={group.title} /><SpeciesFaqSection items={faq} /><SpeciesResponsibility /><Link to="/especies" className="inline-block text-primary underline">Ver todas as espécies</Link></div>
    </article>
  </>;
}