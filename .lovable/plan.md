

## Plano: Imagens Premium (Pro) + Hierarquia de Precos

### A) IMAGENS - QUALIDADE MAXIMA

#### A1. Utilitario `supabaseImageUrl.ts` - Qualidade 90, sem fallback

- Alterar qualidade padrao de 85 para **90**
- Manter breakpoints: 480w, 768w, 1200w, 1600w
- Formato WebP mantido (suporte universal; AVIF ainda limitado no Supabase)

#### A2. `OptimizedImage` - Remover fallback degradante

Atualmente, no `handleError`, se a URL transformada falha, o componente tenta a URL original (sem transformacao). Com o Pro ativo, isso nao e mais necessario e pode servir imagem em resolucao errada.

- Remover o fallback que troca `srcset` e `src` para a URL original no `handleError`
- Se a imagem falhar, ir direto para o estado de erro (placeholder "Sem imagem")
- Alterar qualidade padrao do componente de 85 para 90

#### A3. Catalogo (`CatalogProductCard.tsx`)

- Alterar `quality={85}` para `quality={90}`
- `sizes` e `CATALOG_SIZES` ja estao corretos para o grid de 4 colunas

#### A4. Produtos em Destaque (`FeaturedProductCard.tsx`)

- Alterar `quality={85}` para `quality={90}`

#### A5. Pagina do Produto - Imagem Principal (`ProductImageZoom.tsx`)

Atualmente usa `<img src={selectedImage}>` direta, **sem** srcset/transformacao. Correcoes:

- Importar `getTransformedUrl` e `getSrcSet`
- Imagem principal: servir com `srcSet` (480w, 768w, 1200w, 1600w) e src padrao de **1600w** com qualidade 90
- `sizes="(max-width: 768px) 100vw, 50vw"` (ocupa 50% no desktop, 100% no mobile)

#### A6. Pagina do Produto - Thumbnails (`ProductImageZoom.tsx`)

Atualmente usa `<img src={image.url}>` direta. Correcoes:

- Servir thumbnails com `getTransformedUrl` a **480w** (thumbnails exibidas ~80-120px, 480px = ~4x, suficiente para retina)
- Qualidade 90, formato WebP

---

### B) HIERARQUIA DE PRECO - Pagina do Produto

Problema atual em `ProductDetail.tsx` (linhas 175-193):
- Destaque principal (texto 3xl, cor serpente): preco cheio/parcelado
- Preco PIX: aparece abaixo, menor, como informacao secundaria

Correcao na secao de precos:

```text
De R$ X.XXX,XX          (riscado, texto pequeno, muted)
R$ X.XXX,XX no PIX      (texto 3xl, bold, verde = DESTAQUE MAXIMO)
  XX% OFF               (badge verde ao lado)
ou R$ X.XXX,XX em 10x   (texto sm, muted = secundario)
```

Implementacao:

1. **Preco original** (se existir): `text-sm line-through text-muted-foreground` - "De R$ X.XXX,XX"
2. **Preco PIX** (se existir): `text-3xl font-bold text-green-600` - "R$ X.XXX,XX no PIX" + badge com desconto calculado dinamicamente: `Math.round((1 - pixPrice/originalPrice) * 100)` ou `Math.round((1 - pixPrice/price) * 100)` se nao houver originalPrice
3. **Parcelado**: `text-sm text-muted-foreground` - "ou R$ X.XXX,XX em ate 10x sem juros"
4. Se nao houver `pixPrice`, o preco cheio continua como destaque principal

---

### Arquivos Modificados

| Arquivo | Mudanca |
|---------|---------|
| `src/utils/supabaseImageUrl.ts` | Qualidade padrao 85 -> 90 |
| `src/components/ui/optimized-image.tsx` | Qualidade 90, remover fallback degradante |
| `src/components/catalog/CatalogProductCard.tsx` | quality 90 |
| `src/components/home/FeaturedProductCard.tsx` | quality 90 |
| `src/components/product/ProductImageZoom.tsx` | Adicionar srcSet na imagem principal (1600w), thumbnails otimizadas (480w) |
| `src/pages/ProductDetail.tsx` | Inverter hierarquia de precos: PIX = destaque, parcelado = secundario |

