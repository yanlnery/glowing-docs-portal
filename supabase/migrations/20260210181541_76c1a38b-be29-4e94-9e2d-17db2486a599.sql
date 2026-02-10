-- Backfill product_code in historical order_items from products.meta->>'productId'
UPDATE order_items oi
SET product_code = (p.meta->>'productId')
FROM products p
WHERE oi.product_id = p.id
  AND oi.product_code IS NULL
  AND p.meta->>'productId' IS NOT NULL;