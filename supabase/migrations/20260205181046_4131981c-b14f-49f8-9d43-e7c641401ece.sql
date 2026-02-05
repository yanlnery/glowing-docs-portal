-- Update existing orders with order_numbers using a DO block
DO $$
DECLARE
  order_rec RECORD;
  counter INTEGER := 1;
BEGIN
  FOR order_rec IN 
    SELECT id FROM public.orders 
    WHERE order_number IS NULL 
    ORDER BY created_at ASC
  LOOP
    UPDATE public.orders 
    SET order_number = 'PS-' || LPAD(counter::text, 6, '0')
    WHERE id = order_rec.id;
    counter := counter + 1;
  END LOOP;
  
  -- Update sequence to start after the last used number
  PERFORM setval('public.order_number_seq', counter);
END $$;