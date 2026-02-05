

## Plano: Sistema Completo de Gestão de Pedidos (Admin Orders)

### Resumo Executivo

Implementar uma área administrativa robusta para gerenciar pedidos, com novos status operacionais, tabela de auditoria (order_events), filtros avançados por período, busca por order_number, e botão para copiar mensagem WhatsApp.

---

### 1. Alterações no Banco de Dados

#### 1.1 Adicionar colunas na tabela `orders`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `order_number` | text | Código amigável (ex: PS-000123) |
| `whatsapp_clicked_at` | timestamp | Quando clicou no botão WhatsApp |
| `confirmed_at` | timestamp | Data de confirmação do pagamento |
| `confirmed_by` | uuid | Admin que confirmou |
| `admin_notes` | text | Notas internas do admin |

#### 1.2 Criar tabela `order_events` (auditoria)

```text
┌─────────────────────────────────────────────────────────┐
│                     order_events                        │
├──────────────┬──────────────────────────────────────────┤
│ id           │ uuid (PK)                                │
│ order_id     │ uuid (FK -> orders)                      │
│ event_type   │ text (created, whatsapp_redirect,        │
│              │   contacted, confirmed, cancelled, etc)  │
│ event_data   │ jsonb (dados opcionais)                  │
│ created_at   │ timestamp                                │
│ created_by   │ uuid (admin que executou)                │
└──────────────┴──────────────────────────────────────────┘
```

#### 1.3 Gerar order_number automaticamente

Criar trigger que gera `PS-000001`, `PS-000002`, etc., baseado em sequência.

#### 1.4 Atualizar RLS

- **orders**: Admin pode SELECT/UPDATE tudo; usuário só SELECT do próprio pedido
- **order_events**: Admin pode SELECT/INSERT; usuário não acessa

---

### 2. Atualizar Status do Pedido

Novos status lógicos (não precisa enum de banco):

| Status | Badge | Descrição |
|--------|-------|-----------|
| `pending` | Amarelo | Criado, aguardando contato |
| `contacted` | Azul | Conversa iniciada no WhatsApp |
| `confirmed` | Verde | Pagamento confirmado |
| `cancelled` | Vermelho | Desistiu/sem estoque/não pagou |
| `shipped` | Roxo | Enviado |
| `delivered` | Verde escuro | Entregue (opcional) |

---

### 3. Fluxo de Checkout (Atualização)

Ao finalizar pedido no `CartPage.tsx`:
1. Criar pedido com status `pending`
2. Registrar evento `created` em `order_events`
3. Registrar `whatsapp_clicked_at` = now()
4. Registrar evento `whatsapp_redirect` em `order_events`
5. Abrir WhatsApp

---

### 4. Página Admin - Lista de Pedidos

**Rota**: `/admin/pedidos`

#### 4.1 Estatísticas (KPIs)

```text
┌────────┬────────────┬───────────┬────────────┬──────────┐
│ Total  │ Pendentes  │ Contatado │ Confirmado │ Enviados │
│  45    │    12      │     8     │     20     │    5     │
└────────┴────────────┴───────────┴────────────┴──────────┘
```

#### 4.2 Filtros

- **Status**: pending, contacted, confirmed, cancelled, shipped, delivered
- **Período**: 7/30/90 dias ou data customizada
- **Busca**: por order_number, nome do cliente, email, CPF

#### 4.3 Tabela de Pedidos

| Data | Nº Pedido | Cliente | Email | Total | Status | Ações |
|------|-----------|---------|-------|-------|--------|-------|
| 05/02 | PS-000123 | João Silva | joao@... | R$ 1.200 | Pendente | Ver |

#### 4.4 Ordenação

- Padrão: mais recentes primeiro
- Opção: "Pendentes primeiro" (útil para operação)

---

### 5. Página Admin - Detalhes do Pedido

**Rota**: `/admin/pedidos/:id`

#### 5.1 Seções

1. **Dados do Cliente**
   - Nome, CPF, Telefone
   - Endereço completo

2. **Itens do Pedido**
   - Lista com nome, espécie, quantidade, preço

3. **Resumo Financeiro**
   - Subtotal, Total
   - Método de pagamento

4. **Timeline de Eventos**
   - Criado em: 05/02 14:30
   - WhatsApp clicado: 05/02 14:30
   - Contatado em: 05/02 15:00 (Admin: fulano@...)
   - Confirmado em: 05/02 16:30

5. **Notas Internas**
   - Campo de texto para admin adicionar observações

#### 5.2 Ações (Botões)

```text
┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐
│ Marcar Contatado│ │ Confirmar Venda │ │    Cancelar    │
└─────────────────┘ └─────────────────┘ └────────────────┘

┌─────────────────────────────────────────────────────────┐
│               Copiar Mensagem WhatsApp                  │
└─────────────────────────────────────────────────────────┘
```

O botão "Copiar Mensagem WhatsApp" regenera o texto do pedido para facilitar atendimento.

---

### 6. Arquivos a Criar/Modificar

#### Novos Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `src/pages/admin/OrdersAdmin.tsx` | Lista de pedidos (já existe, será reformulado) |
| `src/pages/admin/OrderDetail.tsx` | Detalhes do pedido |
| `src/services/orderEventsService.ts` | CRUD de eventos de auditoria |
| `src/types/orderEvents.ts` | Tipos para order_events |
| `src/components/admin/orders/OrderStatusBadge.tsx` | Badge de status |
| `src/components/admin/orders/OrderTimeline.tsx` | Timeline de eventos |
| `src/components/admin/orders/OrderFilters.tsx` | Componente de filtros |

#### Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/App.tsx` | Adicionar rota `/admin/pedidos/:id` |
| `src/layouts/AdminLayout.tsx` | Adicionar link "Pedidos" no menu |
| `src/services/orderService.ts` | Adicionar métodos para novos campos e filtros |
| `src/pages/CartPage.tsx` | Registrar whatsapp_clicked_at e criar eventos |
| `src/types/order.ts` | Adicionar novos campos |

---

### 7. Segurança (RLS)

#### 7.1 Tabela `orders`

```sql
-- Admin pode ver/editar tudo
CREATE POLICY "orders_admin_all" ON orders FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Usuário só vê próprio pedido
CREATE POLICY "orders_user_select" ON orders FOR SELECT
USING (user_id = auth.uid());

-- Usuário pode criar próprio pedido
CREATE POLICY "orders_user_insert" ON orders FOR INSERT
WITH CHECK (user_id = auth.uid());
```

#### 7.2 Tabela `order_events`

```sql
-- Apenas admin pode ler e inserir
CREATE POLICY "order_events_admin_all" ON order_events FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));
```

---

### 8. Detalhes Técnicos

#### 8.1 Geração de order_number

Trigger que gera número sequencial formatado:

```sql
CREATE SEQUENCE order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS trigger AS $$
BEGIN
  NEW.order_number := 'PS-' || LPAD(nextval('order_number_seq')::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_number();
```

#### 8.2 Registro de Eventos

Toda mudança de status chama:

```typescript
await orderEventsService.createEvent({
  order_id: orderId,
  event_type: 'confirmed',
  event_data: { previous_status: 'pending' },
  created_by: adminUserId
});
```

#### 8.3 Filtro por Período

```typescript
const filterByPeriod = (days: number) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  return startDate.toISOString();
};
```

---

### 9. Cronograma de Implementação

1. **Migração do banco** - Criar colunas e tabela order_events
2. **Atualizar types e services** - Tipos e métodos novos
3. **Reformular OrdersAdmin** - Lista com novos filtros e status
4. **Criar OrderDetail** - Página de detalhes com timeline
5. **Atualizar CartPage** - Registrar eventos no checkout
6. **Atualizar AdminLayout** - Adicionar menu de pedidos
7. **Testes end-to-end** - Validar fluxo completo

