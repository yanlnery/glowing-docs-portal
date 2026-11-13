# Páginas próprias por espécie

## Escopo
- Criar uma ficha independente em `/especies-criadas/:slug`, usando somente conteúdo existente e os textos fornecidos.
- Resolver slugs atuais e legados, mantendo redirecionamentos; criar os grupos Jiboia e Jiboia Arco-íris somente quando não houver espécie com o mesmo slug.
- Incluir galeria, disponibilidade, lista de espera existente, ficha técnica, curiosidades, vídeo, manual diretamente vinculado, FAQ e outras espécies.
- Reutilizar SEO para título, descrição, canonical, BreadcrumbList, FAQPage e VideoObject.
- Na listagem existente, adicionar somente links para fichas completas e grupos.
- Redirecionar `/educacao` para `/manuais`; substituir links ativos caso existam. A leitura não encontrou links ativos fora da página Education, que ficará preservada e sem rota.
- Adicionar apenas o link solicitado no animal, isolando sua busca em um novo componente.
- Ajustar o script do sitemap com os grupos, exclusões e `lastmod` baseado exclusivamente no `updated_at` de cada registro.

## Detalhes técnicos
- Helpers separados para grupos, extração de características, FAQ e resolução de slugs, com testes das regras.
- Reutilizar OptimizedImage da galeria existente em uma galeria própria para não modificar o visual da listagem. Preservar proporção 4:3, foco por dispositivo e prioridade da primeira imagem.
- Usar cartões próprios de links canônicos para animais, pois o cartão atual do catálogo usa URLs antigas; não alterar esse cartão.
- Manter schema, dados, políticas, SEO compartilhado e todos os fluxos protegidos intactos. Nenhuma publicação.

## Verificação
- Testes das regras e verificação automática de compilação.
- Navegação real no preview em 375px e 1280px, claro/escuro, nos seis endereços solicitados, sem overflow.
- Conferir H1 único, metadados, JSON-LD, navegação entre fichas, redirects, NotFound e páginas protegidas.
- Abrir o formulário da lista de espera sem enviar; bloquear requisições de escrita durante os testes.
- Entregar a lista de arquivos alterados e criados.