import { expect, test } from 'bun:test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';

test('sitemap uses record updated_at only, includes groups and omits retired routes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'species-sitemap-'));
  try {
    mkdirSync(join(dir, 'public'));
    const preload = join(dir, 'fetch.ts');
    writeFileSync(preload, `globalThis.fetch = async (url) => Response.json(String(url).includes('/products?') ? [
      {slug:'old-animal',new_slug:'animal-new',updated_at:'2026-10-02T12:00:00Z'},
      {slug:'undated-animal',new_slug:null,updated_at:null}
    ] : [
      {slug:'old-species',new_slug:'species-new',updated_at:'2026-09-01T09:30:00Z'},
      {slug:'undated-species',new_slug:null,updated_at:null}
    ]);`);
    const result = Bun.spawnSync(['bun', '--preload', preload, resolve('scripts/generate-sitemap.ts')], { cwd: dir });
    expect(result.exitCode).toBe(0);
    const xml = readFileSync(join(dir, 'public/sitemap.xml'), 'utf8');
    expect(xml).toContain('/especies-criadas/jiboia-arco-iris</loc>');
    expect(xml).toContain('/especies-criadas/jiboia</loc>');
    for (const path of ['/academy', '/educacao', '/lista-de-espera']) expect(xml).not.toContain(`${path}</loc>`);
    expect(xml).toContain('<lastmod>2026-10-02T12:00:00.000Z</lastmod>');
    expect(xml).toContain('<lastmod>2026-09-01T09:30:00.000Z</lastmod>');
    expect((xml.match(/<lastmod>/g) || []).length).toBe(2);
    expect(xml).toContain('/animais/animal-new</loc>');
    expect(xml).toContain('/especies-criadas/species-new</loc>');
    expect(xml).not.toContain('/old-species');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});