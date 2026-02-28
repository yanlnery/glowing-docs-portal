
Objetivo: sim, dá para melhorar mais. O que está acontecendo hoje é que já resolvemos o blur de transform no hover, mas ainda existe perda de detalhe por estratégia de transformação/compressão (`format=webp` + `quality=90`) e por largura efetiva fixa em alguns contextos. Vou atacar isso com uma estratégia de “qualidade máxima controlada” só para Home (destaques) e Catálogo.

Diagnóstico confirmado no código atual
1. `OptimizedImage` força `format: 'webp'` no `src` principal e no `srcset`, com `quality` padrão 90.
2. No Catálogo, o card usa `forcedWidth=1200` e `disableSrcSet`, o que limita a adaptação para telas com densidade alta.
3. Na Home (destaques), usa `srcset` por largura, mas ainda com `webp`/90, que pode gerar artefato em textura fina (escamas, madeira, fundo).
4. O blur por hover no `<img>` já foi evitado (zoom no wrapper), então o problema restante é principalmente de pipeline de imagem.

Plano de implementação (próxima execução)
1) Tornar o formato/qualidade configurável no `OptimizedImage`
- Arquivo: `src/components/ui/optimized-image.tsx`
- Adicionar props para controle de transformação:
  - `transformFormat?: 'webp' | 'avif' | 'origin'`
  - `srcSetStrategy?: 'w' | 'x'` (ou reaproveitar `useXDescriptors` de forma mais explícita)
  - `maxWidth?: number` (para limitar sem travar em 1200)
- Manter compatibilidade com uso atual (defaults existentes), mas permitir override por tela crítica.

2) Ajustar utilitário de URL para cenários “nitidez máxima”
- Arquivo: `src/utils/supabaseImageUrl.ts`
- Permitir `getSrcSet` receber formato configurável (não só webp fixo).
- Manter `getXDescriptorSrcSet` e usar com base maior para desktop.
- Definir preset para cards críticos:
  - qualidade alta (ex.: 96–100)
  - `format: 'origin'` (evita dupla compressão perceptível em JPEG já comprimido).

3) Catálogo com estratégia de alta nitidez em desktop
- Arquivo: `src/components/catalog/CatalogProductCard.tsx`
- Trocar configuração atual para uma destas abordagens:
  - Preferencial: `x-descriptors` com base adequada do card (ex.: 420~520) para garantir 2x/3x em retina.
  - Alternativa segura: manter `forcedWidth`, subir para 1600 em desktop.
- Remover `disableSrcSet` (ou manter apenas em casos específicos), para o browser escolher melhor fonte por DPR.
- Manter zoom no wrapper (sem transform no `<img>`).

4) Destaques da Home com mesma política de nitidez
- Arquivo: `src/components/home/FeaturedProductCard.tsx`
- Aplicar mesma receita do catálogo:
  - formato configurável (`origin` para preservar detalhe),
  - qualidade mais alta,
  - `x-descriptors` ou width maior para desktop.
- Manter hover apenas no wrapper.

5) Salvaguarda de performance (mobile)
- Não aplicar “modo ultra” globalmente.
- Escopo: apenas Home Destaques + Catálogo.
- Mobile continua com transform otimizada para evitar aumento exagerado de banda.

Validação (critérios de aceite)
1. Home (Destaques): imagem com nitidez visivelmente superior em desktop.
2. Catálogo: nitidez superior, sem aspecto “pixelado” em desktop.
3. Hover continua suave, sem blur de compositing.
4. `currentSrc` em desktop passa a refletir fonte mais robusta (largura maior e/ou formato origin em cenários críticos).
5. Sem regressão de carregamento no mobile perceptível.

Risco e limite realista
- Se algum arquivo original já estiver muito comprimido na origem, existe teto de qualidade (não dá para “inventar detalhe”).
- Mesmo assim, este plano reduz bastante artefatos e tende a deixar o resultado mais nítido, especialmente em telas retina.

Se aprovado, eu implemento exatamente nesses 4 arquivos e deixo um “preset de nitidez” reutilizável para qualquer outra grade de imagens no projeto.
