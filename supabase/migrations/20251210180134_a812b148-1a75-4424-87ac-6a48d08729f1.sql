-- Restaurar textos originais do carrossel removendo apenas "100% Legalizado"
UPDATE carousel_items 
SET 
  title = 'Animais Silvestres Legalizados',
  subtitle = 'Venha conhecer as espécies mais fascinantes em um Criadouro Legalizado pelo IBAMA e INEA-RJ',
  alt_text = 'Venha conhecer as espécies mais fascinantes em um Criadouro Legalizado pelo IBAMA e INEA-RJ'
WHERE item_order = 1;

UPDATE carousel_items 
SET 
  title = 'Animais legalizados com procedência',
  subtitle = 'Criação responsável, com autorização dos órgãos ambientais e acompanhamento veterinário'
WHERE item_order = 2;