import type { Species } from '@/types/species';

export type SpeciesFaq = { question: string; answer: string };
export const normalizeLabel = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export function splitCharacteristic(value: string) {
  const colon = value.indexOf(':');
  return colon < 0 ? { label: '', value: value.trim() } : { label: value.slice(0, colon).trim(), value: value.slice(colon + 1).trim() };
}

export function characteristicValue(characteristics: string[], prefix: string) {
  const normalized = normalizeLabel(prefix);
  const item = (characteristics || []).map(splitCharacteristic).find(item => {
    const label = normalizeLabel(item.label);
    // A recinto label must not accidentally become the animal's adult size.
    return label.startsWith(normalized) && !(normalized === 'tamanho' && label.startsWith('tamanho de recinto'));
  });
  return item?.value || '';
}

export const fixedSpeciesFaq: SpeciesFaq[] = [
  { question: 'Preciso de autorização para ter este animal?', answer: 'Não. Animais nascidos em criadouro comercial autorizado são vendidos com nota fiscal e documentação Sisfauna, que comprovam a origem legal. Guarde esses documentos.' },
  { question: 'Como o animal viaja?', answer: 'Por transporte aéreo (Gollog ou Latam), em caixa de transporte adequada, com consulta veterinária prévia e GTA.' },
  { question: 'Quanto custa o envio?', answer: 'Entre R$ 250 e R$ 365, conforme a região e o horário do voo. O valor é informado antes do fechamento.' },
];
export const venomAnswer = 'Não. É uma serpente constritora, sem veneno.';

export function buildSpeciesFaq(species: Pick<Species, 'commonname' | 'name' | 'characteristics' | 'faq'>): SpeciesFaq[] {
  const name = species.commonname;
  const generated = [
    ['Tamanho', `Qual o tamanho adulto de ${name}?`],
    ['Temperamento', `${name} é dócil?`],
    ['Tamanho de recinto recomendado', `Qual o tamanho do recinto para ${name}?`],
    ['Temperatura ideal', `Qual a temperatura ideal para ${name}?`],
    ['Dieta', `O que ${name} come?`],
  ].flatMap(([label, question]) => {
    const answer = characteristicValue(species.characteristics, label);
    return answer ? [{ question, answer }] : [];
  });
  return [
    ...(species.faq || []).filter(item => item?.question?.trim() && item?.answer?.trim()),
    ...generated,
    ...(/^(Boa|Epicrates|Corallus)/.test(species.name) ? [{ question: `${name} é venenosa?`, answer: venomAnswer }] : []),
    ...fixedSpeciesFaq,
  ];
}

export function truncateDescription(text: string, max = 160) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const truncated = clean.slice(0, max - 3);
  const space = truncated.lastIndexOf(' ');
  return `${space > 0 ? truncated.slice(0, space) : truncated}...`;
}

export const speciesDescription = (species: Pick<Species, 'name' | 'description'>) => truncateDescription(`Espécie ${species.name}: ${species.description || ''}`);