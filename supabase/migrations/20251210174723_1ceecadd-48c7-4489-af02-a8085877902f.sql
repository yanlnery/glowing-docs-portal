-- Atualizar textos do carrossel removendo "100% Legalizado"
UPDATE carousel_items 
SET 
  title = 'Répteis Nativos com Procedência',
  subtitle = 'Serpentes, lagartos e quelônios nascidos em criadouro certificado IBAMA e INEA-RJ'
WHERE item_order = 1;

UPDATE carousel_items 
SET 
  title = 'Criação Responsável e Documentada',
  subtitle = 'Cada animal acompanha nota fiscal e documentação ambiental para regularização'
WHERE item_order = 2;