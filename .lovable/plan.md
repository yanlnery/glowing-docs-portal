# Plano: vídeo e FAQ no admin de espécies

## Alterações
- Adicionar ao formulário administrativo um campo opcional para URL do YouTube.
- Adicionar um editor de FAQ com pares de pergunta e resposta, permitindo incluir e remover itens.
- Inicializar novas espécies com vídeo vazio e FAQ vazio; ao editar, carregar os valores já salvos.
- Incluir `video_url` e `faq` no formato lido e no payload usado para criar ou atualizar espécies.

## Detalhes técnicos
- Manter o estado no gerenciador atual do diálogo, com handlers específicos para editar, adicionar e remover FAQs.
- Normalizar URL vazia para `null` e FAQs sem conteúdo para um array vazio antes do salvamento.
- Não alterar páginas públicas, banco de dados, catálogo ou qualquer outra parte do PR8.

## Verificação
- Rodar o type-check do projeto.
- Conferir no preview que o formulário abre com os dados existentes e permite editar os dois novos campos, sem salvar dados de teste.
