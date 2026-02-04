

## Diagnóstico: Erro "535 API key not found"

O erro nos logs do Supabase Auth é claro:
```
"error":"535 API key not found"
"msg":"500: Error sending recovery email"
```

O código do projeto está **100% correto**. O problema é que as credenciais SMTP do Resend não estão configuradas no Supabase Dashboard.

---

## Solução: Configurar SMTP no Supabase Dashboard

### Passo a Passo

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard/project/xlhcneenthhhsjqqdmbm/settings/auth

2. **Na seção "SMTP Settings"**, ative o Custom SMTP e preencha:

   | Campo | Valor |
   |-------|-------|
   | **Host** | `smtp.resend.com` |
   | **Port** | `465` |
   | **Username** | `resend` |
   | **Password** | Sua API key do Resend (começa com `re_`) |
   | **Sender email** | `noreply@petserpentes.com.br` |
   | **Sender name** | `Pet Serpentes` |

3. **Clique em "Save"**

---

## Onde Obter a API Key do Resend

1. Acesse: https://resend.com/api-keys
2. Clique em "Create API Key"
3. Dê um nome (ex: "Supabase Auth")
4. Copie a chave gerada (formato: `re_xxxxxxxxxx`)
5. Cole no campo **Password** do SMTP Settings no Supabase

---

## Por Que Isso Resolve

O código atual usa `supabase.auth.resetPasswordForEmail()` que delega o envio de email ao Supabase. O Supabase precisa das credenciais SMTP configuradas para poder enviar emails. Sem essas credenciais, ele retorna "535 API key not found".

Após configurar o SMTP:
- Reset de senha funcionará
- Confirmação de email funcionará
- Magic links funcionarão

---

## Nenhuma Alteração de Código Necessária

O arquivo `src/services/authService.ts` já está correto:
- Usa `supabase.auth.resetPasswordForEmail()` nativo
- Não chama edge functions para envio de email
- O redirectTo está configurado para `/reset-password`

