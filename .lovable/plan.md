
Objetivo
Garantir que as imagens do catálogo (“Animais Disponíveis”) sejam exibidas com a mesma fidelidade do arquivo original enviado no admin, sem perda de qualidade no caminho de dados (upload → banco → render no catálogo), priorizando correção de URL/src e sem mexer em layout visual.

Diagnóstico (feito no código atual)
1) O upload no admin já salva URL original do Storage:
- `ProductImageManager` → `uploadFileToStorage(...)`
- `fileStorageService.uploadFileToStorage` retorna `getPublicUrl(...)`
- Isso gera URL em `/storage/v1/object/public/...` (arquivo original), sem `?width`, `?quality`, `?format`.

2) O catálogo usa:
- `CatalogProductsGrid` → `CatalogProductCard` → `OptimizedImage`.
- No estado atual, o card já passa `disableTransform` e `disableSrcSet`, e a URL está sendo normalizada para `/object/public/`.
- No replay da sessão, os `<img>` do catálogo aparecem com `src` em `/storage/v1/object/public/product_images/...` (sem query params), confirmando que transform do Supabase não está sendo aplicado no card.

3) O PDP (página do produto) não usa exatamente a mesma estratégia:
- `ProductImageZoom` aplica `getTransformedUrl(... width=1600, quality=90, format=webp)` na imagem principal.
- Ou seja, hoje PDP e catálogo não compartilham o mesmo caminho de URL.

Risco principal identificado
Mesmo com URL original no catálogo, ainda pode haver percepção de “soft” no desktop por:
- diferença de rasterização no componente de catálogo vs PDP;
- carga por `OptimizedImage` (lazy/intersection/placeholder/debug) introduzindo variáveis desnecessárias;
- eventual conteúdo histórico no banco com URL “render” em alguns produtos (já mitigado em parte localmente no card, mas não centralizado no pipeline).

Estratégia de reestruturação (implementação)
1) Centralizar a normalização de URL de imagem (fonte única de verdade)
- Criar um utilitário dedicado (ex.: `normalizeProductStorageUrl`) para:
  - remover query params;
  - converter `/storage/v1/render/image/public/` para `/storage/v1/object/public/`.
- Aplicar essa normalização na camada de dados (`transformSupabaseProduct`), não só no card.
Resultado: qualquer tela que consuma produto já recebe URL canônica original.

2) Simplificar o catálogo para usar `<img src="...">` direto no card
- No `CatalogProductCard`, substituir apenas a renderização de imagem para caminho direto e estável:
  - `src={urlOriginalNormalizada}`
  - sem `srcSet`, sem `sizes`, sem transforms.
- Manter todas as classes/layout exatamente iguais (sem alteração visual de grid/card/aspect/object-fit).
Resultado: elimina qualquer variação de fonte entre mobile e desktop no catálogo.

3) Manter PDP como está (por enquanto), mas alinhar comparação técnica
- Não alterar layout nem comportamento da PDP nesta etapa.
- Apenas garantir que catálogo sempre use o original puro para preservar fidelidade do upload.

4) Blindagem de dados legados
- Na normalização da camada de dados, tratar entradas antigas (com `render` ou query string) automaticamente.
- Evita depender de correção “local” em cada componente.

5) Instrumentação de validação (dev)
- Expor (somente DEV) log leve por card com:
  - `currentSrc`,
  - `naturalWidth`,
  - `renderedWidth`,
  - URL final normalizada.
- Sem UI extra em produção.

Critérios de aceite (objetivos e verificáveis)
1) No catálogo desktop e mobile, `img.currentSrc` deve ser URL `/storage/v1/object/public/...` sem query params.
2) Não deve existir `srcset` no `<img>` do card do catálogo.
3) O mesmo produto deve usar a mesma URL base no catálogo (mobile e desktop).
4) Imagem do catálogo mantém nitidez do arquivo enviado no admin (sem depender de hover/zoom).
5) Layout do card permanece idêntico (sem mudanças de CSS/estrutura visual).

Plano de validação (DevTools)
1) Abrir `/catalogo`, selecionar um card.
2) Inspecionar `<img>`:
- confirmar `src` em `/object/public/`;
- confirmar ausência de `srcset` e `sizes`.
3) No Network (filtro `product_images`):
- confirmar request direto no objeto original sem query params.
4) Comparar `naturalWidth` vs tamanho renderizado:
- se `naturalWidth` for baixo no arquivo original, registrar limite real de origem;
- se alto, qualidade final deve permanecer nítida.

Arquivos previstos para alteração na implementação
- `src/services/productQueries.ts` (normalização central do array `images`)
- `src/components/catalog/CatalogProductCard.tsx` (fonte única de `src` direto no catálogo)
- (opcional e pequeno) utilitário novo em `src/utils/` para normalização de URL

Sequenciamento
1) Implementar normalização central.
2) Ajustar `CatalogProductCard` para render de `src` único original.
3) Validar no preview com DevTools (currentSrc/network).
4) Revisar regressão rápida em Home/PDP/admin (sem alterar layout).

Observação técnica importante
Pelo estado atual auditado, o catálogo já está majoritariamente em `/object/public/`. A reestruturação acima consolida isso no pipeline (não só no componente), elimina variabilidade residual e deixa o caminho de imagem robusto para todos os uploads novos e antigos.
