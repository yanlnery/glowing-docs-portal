import { describe, expect, test } from 'bun:test';
import { buildSpeciesFaq, characteristicValue, fixedSpeciesFaq, speciesDescription } from '../src/lib/speciesProfile';
import { resolveSpeciesRoute, speciesGroups } from '../src/lib/speciesGroups';
import type { Species } from '../src/types/species';

const specimen = (overrides: Partial<Species> = {}): Species => ({
  id: 'species-a', name: 'Epicrates assisi', commonname: 'Jiboia Arco-íris da Caatinga',
  slug: 'epicrates-assisi', new_slug: 'jiboia-arco-iris-da-caatinga', legacy_slug: 'old-assisi',
  type: 'serpente', description: 'Descrição existente. '.repeat(30), characteristics: [], curiosities: [], gallery: [], image: null, order: 1, ...overrides,
});

describe('species profile rules', () => {
  test('species slug wins over a group slug and legacy species redirects to new_slug', () => {
    const species = specimen({ slug: 'jiboia', new_slug: 'jiboia-nativa' });
    expect(resolveSpeciesRoute([species], 'jiboia').group).toBeUndefined();
    expect(resolveSpeciesRoute([species], 'jiboia').species?.id).toBe('species-a');
    expect(resolveSpeciesRoute([species], 'jiboia').redirect).toBe('/especies-criadas/jiboia-nativa');
    expect(resolveSpeciesRoute([specimen()], 'old-assisi').redirect).toBe('/especies-criadas/jiboia-arco-iris-da-caatinga');
    expect(resolveSpeciesRoute([specimen()], 'jiboia-arco-iris-da-caatinga').redirect).toBeNull();
  });
  test('groups contain only Epicrates or Boa constrictor respectively', () => {
    expect(speciesGroups[0].filter({ name: 'Epicrates assisi' })).toBe(true);
    expect(speciesGroups[0].filter({ name: 'Boa constrictor amarali' })).toBe(false);
    expect(speciesGroups[1].filter({ name: 'Boa constrictor constrictor' })).toBe(true);
    expect(speciesGroups[1].filter({ name: 'Corallus hortulanus' })).toBe(false);
    expect(resolveSpeciesRoute([], 'jiboia-arco-iris').group?.slug).toBe('jiboia-arco-iris');
    expect(resolveSpeciesRoute([], 'missing').group).toBeUndefined();
  });
  test('facts match accent-insensitive prefixes, without confusing adult size with enclosure size', () => {
    const facts = ['TAMANHO DE RECINTO RECOMENDADO: 120 cm', 'Tamanho adulto: 150 cm', 'Temperaménto: dócil', 'Bioma de Origem: Caatinga'];
    expect(characteristicValue(facts, 'Tamanho')).toBe('150 cm');
    expect(characteristicValue(facts, 'Tamanho de recinto recomendado')).toBe('120 cm');
    expect(characteristicValue(facts, 'Temperamento')).toBe('dócil');
    expect(characteristicValue(facts, 'Dieta')).toBe('');
    expect(characteristicValue(['Tamanho de recinto recomendado: 120 cm'], 'Tamanho')).toBe('');
  });
  test('derived answers use existing facts only, preserve stored FAQ first and fixed questions last', () => {
    const faq = buildSpeciesFaq(specimen({ faq: [{ question: 'Existente?', answer: 'Do banco.' }], characteristics: ['Tamanho: 150 cm', 'Dieta: Valor cadastrado'] }));
    expect(faq[0]).toEqual({ question: 'Existente?', answer: 'Do banco.' });
    expect(faq[1].answer).toBe('150 cm');
    expect(faq[2].answer).toBe('Valor cadastrado');
    expect(faq.slice(-3)).toEqual(fixedSpeciesFaq);
    expect(faq.some(item => item.question.includes('temperatura'))).toBe(false);
  });
  test('venom answer is restricted to the three specified scientific prefixes', () => {
    for (const name of ['Boa constrictor', 'Epicrates assisi', 'Corallus hortulanus']) {
      expect(buildSpeciesFaq(specimen({ name })).some(item => item.question.endsWith('é venenosa?'))).toBe(true);
    }
    expect(buildSpeciesFaq(specimen({ name: 'Iguana iguana' })).some(item => item.question.endsWith('é venenosa?'))).toBe(false);
  });
  test('metadata description includes scientific prefix and never exceeds 160 characters', () => {
    const description = speciesDescription(specimen());
    expect(description.startsWith('Espécie Epicrates assisi:')).toBe(true);
    expect(description.length).toBeLessThanOrEqual(160);
  });
});