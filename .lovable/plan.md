

## Problema

A coluna "Produtos" na lista de pedidos mostra "-" porque o campo `product_code` nos itens de pedido esta vazio para todos os pedidos anteriores (apenas o PS-000032 tem esse dado). Os produtos possuem o ID customizado (ex: SM4487, F1-1, II02) armazenado em `products.meta->productId`, mas esse valor nao foi salvo nos pedidos historicos.

## Solucao

### 1. Migracao SQL - Preencher pedidos historicos

Criar uma migracao que atualiza todos os `order_items` que tem `product_code` nulo, buscando o `productId` do campo `meta` do produto correspondente:

```sql
UPDATE order_items oi
SET product_code = (p.meta->>'productId')
FROM products p
WHERE oi.product_id = p.id
  AND oi.product_code IS NULL
  AND p.meta->>'productId' IS NOT NULL;
```

### 2. UI - Exibir product_code na coluna Produtos (OrdersAdmin.tsx)

Ajustar a coluna para sempre mostrar o `product_code` de forma destacada. Se nao houver `product_code`, exibir o `product_name` como fallback. Formato: `#SM4487 - Teiu`.

### 3. UI - Exibir product_code no detalhe do pedido (OrderDetail.tsx)

Ja foi feito parcialmente, mas garantir que o `product_code` aparece de forma consistente nos itens do pedido.

---

## Detalhes Tecnicos

**Arquivos modificados:**
- Nova migracao SQL para backfill dos product_codes
- `src/integrations/supabase/types.ts` (se necessario apos migracao)
- `src/pages/admin/OrdersAdmin.tsx` - Garantir exibicao correta do product_code na coluna Produtos

**Dados verificados:**
- 30 dos 31 pedidos tem `product_code` nulo
- Todos os produtos possuem `meta.productId` preenchido (SM4487, F1-1, II02, etc.)
- O `product_id` (UUID) nos order_items faz o link correto com a tabela products

