const FIXED_PAGES: Record<string, string> = {
  '/pagina-especies_criadas': '/especies',
  '/pagina-politica_de_privacidade': '/politica-de-privacidade',
  '/pagina-certificado_de_regularidade_ibama': '/sobre',
  '/login-recupera_senha': '/forgot-password',
};

const normalizeText = (value: string): string => {
  let decoded = value;
  try { decoded = decodeURIComponent(value); } catch { /* keep raw */ }
  return decoded
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[_\-/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const CATEGORY_RULES: Array<[(t: string) => boolean, string]> = [
  [(t) => t.includes('periquitamboia') || t.includes('batesii'), '/especies-criadas/periquitamboia'],
  [(t) => t.includes('caatinga') || t.includes('assisi'), '/especies-criadas/jiboia-arco-iris-da-caatinga'],
  [(t) => t.includes('cenchria') || (t.includes('arco') && t.includes('amazonia')), '/especies-criadas/jiboia-arco-iris-da-amazonia'],
  [(t) => t.includes('crassus') || (t.includes('arco') && t.includes('cerrado')), '/especies-criadas/jiboia-arco-iris-do-cerrado'],
  [(t) => t.includes('maurus'), '/especies-criadas/jiboia-arco-iris-do-norte'],
  [(t) => t.includes('arco'), '/especies-criadas/jiboia-arco-iris'],
  [(t) => t.includes('amarali'), '/especies-criadas/jiboia-do-cerrado'],
  [(t) => t.includes('constrictor constrictor') || (t.includes('jiboia') && t.includes('amazonia')), '/especies-criadas/jiboia-da-amazonia'],
  [(t) => t.includes('jiboia'), '/especies-criadas/jiboia'],
  [(t) => t.includes('cobra d') || t.includes('dagua') || t.includes('dgua') || t.includes('miliaris'), '/especies-criadas/cobra-d-agua'],
  [(t) => t.includes('jabuti'), '/especies-criadas/jabuti-piranga'],
  [(t) => t.includes('caninana'), '/especies-criadas/caninana'],
  [(t) => t.includes('iguana'), '/especies-criadas/iguana'],
  [(t) => t.includes('teiu') || t.includes('salvator'), '/especies-criadas/teiu'],
  [(t) => t.includes('disponiveis') || t.includes('disponveis'), '/catalogo'],
];

/** Maps addresses from the old site platform to their current equivalents; null = not legacy. */
export function resolveLegacyRedirect(pathname: string): string | null {
  const path = (pathname || '').toLowerCase().replace(/\/+$/, '') || '/';

  if (FIXED_PAGES[path]) return FIXED_PAGES[path];
  if (path.startsWith('/pagina-')) return '/';

  if (path.startsWith('/categoria/')) {
    const text = normalizeText(path.slice('/categoria/'.length));
    for (const [match, target] of CATEGORY_RULES) {
      if (match(text)) return target;
    }
    return '/especies';
  }

  return null;
}
