import type { Species } from '@/types/species';

export interface SpeciesGroup {
  slug: string;
  title: string;
  introduction: string;
  compareLabel: string;
  filter: (species: Pick<Species, 'name'>) => boolean;
}

export const speciesGroups: SpeciesGroup[] = [
  {
    slug: 'jiboia-arco-iris', title: 'Jiboia Arco-íris',
    introduction: 'Jiboia arco-íris é o nome popular das serpentes do gênero Epicrates, conhecidas pelo brilho iridescente das escamas. São serpentes constritoras, sem veneno. No Pet Serpentes criamos espécies nativas de biomas diferentes, cada uma com seu porte e suas exigências de manejo. Compare abaixo e abra a página de cada uma para ver a ficha completa.',
    compareLabel: 'Compare com as outras jiboias arco-íris',
    filter: species => species.name.startsWith('Epicrates'),
  },
  {
    slug: 'jiboia', title: 'Jiboia',
    introduction: 'Jiboia é o nome popular de Boa constrictor, serpente constritora e sem veneno, nativa do Brasil. No Pet Serpentes criamos jiboias de biomas diferentes, cada uma com seu porte e suas características. Compare abaixo e abra a página de cada uma para ver a ficha completa.',
    compareLabel: 'Compare com as outras jiboias',
    filter: species => species.name.startsWith('Boa constrictor'),
  },
];

export const speciesPath = (species: Pick<Species, 'new_slug' | 'slug'>) => `/especies-criadas/${species.new_slug || species.slug}`;

export function resolveSpeciesRoute(species: Species[], slug: string) {
  const match = species.find(item => item.new_slug === slug)
    ?? species.find(item => item.slug === slug || item.legacy_slug === slug);
  return {
    species: match,
    group: match ? undefined : speciesGroups.find(group => group.slug === slug),
    redirect: match?.new_slug && match.new_slug !== slug ? speciesPath(match) : null,
  };
}