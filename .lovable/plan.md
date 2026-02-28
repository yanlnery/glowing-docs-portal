

## Correcao: Imagens do Catalogo com Qualidade Baixa

### Diagnostico

As URLs `/render/image/` estao sendo **bloqueadas pelo navegador** (`net::ERR_BLOCKED_BY_ORB` - Opaque Response Blocking) porque esse endpoint retorna headers CORS diferentes do `/object/public/`. O fallback atual reverte para a imagem original sem nenhuma otimizacao, resultando em imagens de baixa qualidade (o navegador carrega o JPEG original e o redimensiona via CSS).

A pagina do produto funciona porque o `ProductImageZoom` ja foi revertido para usar URLs originais diretamente.

### Solucao

Usar **query parameters diretamente na URL `/object/public/`** para transformacoes de imagem, em vez do endpoint `/render/image/`. O Supabase Pro suporta isso nativamente:

```text
ANTES (bloqueado por ORB):
/storage/v1/render/image/public/product_images/xxx.jpg?width=1200&quality=90&format=webp

DEPOIS (funciona cross-origin):
/storage/v1/object/public/product_images/xxx.jpg?width=1200&quality=90&format=webp
```

### Arquivo 1: `src/utils/supabaseImageUrl.ts`

Alterar a funcao `getTransformedUrl` para **adicionar query params diretamente a URL `/object/public/`** em vez de substituir o path para `/render/image/`:

- Remover a funcao `toRenderUrl` completamente
- Em `getTransformedUrl`: apenas remover query params existentes e adicionar `?width=X&quality=Y&format=webp` a URL original
- Manter breakpoints: 480w, 768w, 1200w, 1600w
- Manter qualidade padrao: 90

### Arquivo 2: `src/components/ui/optimized-image.tsx`

Simplificar o `handleError`:
- Como as URLs agora sao do mesmo dominio `/object/public/`, nao devem falhar por ORB
- Manter um fallback basico: se a URL com query params falhar, tentar a URL original (sem params)
- Isso garante que imagens nunca desaparecam

### Arquivo 3: `src/components/product/ProductImageZoom.tsx`

Reintegrar `srcSet` e `sizes` na imagem principal e thumbnails, usando as novas URLs corrigidas:
- Imagem principal: srcSet com 480w, 768w, 1200w, 1600w; src padrao 1600w
- Thumbnails: usar `getTransformedUrl` com width=480 para retina

### Resultado Esperado

- Todas as imagens do catalogo serao servidas em WebP otimizado com resolucao adequada
- Desktop 1440px: browser selecionara candidato 1200w ou 1600w (conforme DPR)
- Nenhum erro ORB, nenhum fallback degradante
- Imagens nitidas tanto no catalogo quanto na pagina do produto

### Detalhes Tecnicos

| Arquivo | Mudanca |
|---------|---------|
| `src/utils/supabaseImageUrl.ts` | Trocar `/render/image/` por query params em `/object/public/` |
| `src/components/ui/optimized-image.tsx` | Simplificar fallback de erro |
| `src/components/product/ProductImageZoom.tsx` | Reintegrar srcSet com URLs corrigidas |

