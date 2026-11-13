import { describe, expect, test } from 'bun:test';
import { resolveLegacyRedirect } from '../src/lib/legacyRedirects';

const cases: Array<[string, string | null]> = [
  ['/pagina-Especies_criadas', '/especies'],
  ['/pagina-Politica_de_Privacidade', '/politica-de-privacidade'],
  ['/pagina-Certificado_de_Regularidade_IBAMA', '/sobre'],
  ['/login-recupera_senha', '/forgot-password'],
  ['/pagina-Qualquer_Outra', '/'],
  ['/categoria/5258277/cobra-dagua-erythrolamprus-miliaris/', '/especies-criadas/cobra-d-agua'],
  ['/categoria/5135955/cobra-dgua/', '/especies-criadas/cobra-d-agua'],
  ['/categoria/4728210/JIBOIA/jiboia-boa-constrictor-constrictor/', '/especies-criadas/jiboia-da-amazonia'],
  ['/categoria/4728252/jiboia-arco-ris-da-amazonia-epicrates-cenchria/', '/especies-criadas/jiboia-arco-iris-da-amazonia'],
  ['/categoria/5388013/animais-disponveis/', '/catalogo'],
  ['/categoria/4728141/PERIQUITAMBOIA--Corallus-batesii-/', '/especies-criadas/periquitamboia'],
  ['/categoria/4728135/JIBOIAS-ARCO-IRIS/', '/especies-criadas/jiboia-arco-iris'],
  ['/categoria/4728135/JIBOIAS_ARCO_IRIS', '/especies-criadas/jiboia-arco-iris'],
  ['/categoria/4728136/JIBOIAS-ARCO-IRIS/Jiboia-Arco-iris-da-Caatinga--Epicrates-assisi-/', '/especies-criadas/jiboia-arco-iris-da-caatinga'],
  ['/categoria/4728136/Jiboia-Arco-iris-da-Caatinga--Epicrates-assisi-/', '/especies-criadas/jiboia-arco-iris-da-caatinga'],
  ['/categoria/5135948/jabutis/', '/especies-criadas/jabuti-piranga'],
  ['/categoria/1/outra-coisa/', '/especies'],
  ['/', null], ['/catalogo', null], ['/especies', null], ['/especies-criadas/x', null],
  ['/animais/x', null], ['/produtos/x', null], ['/sobre', null], ['/contato', null],
  ['/manuais', null], ['/carrinho', null], ['/admin', null], ['/xyz-teste', null],
];

describe('resolveLegacyRedirect', () => {
  for (const [input, expected] of cases) {
    test(`${input} -> ${expected}`, () => expect(resolveLegacyRedirect(input)).toBe(expected));
  }
});
