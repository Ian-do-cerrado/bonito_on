# 📧 Configuração do Sistema de Email

## 🚀 Setup do Resend

### 1. Criar conta no Resend
1. Acesse [resend.com](https://resend.com)
2. Crie uma conta gratuita
3. Verifique seu email

### 2. Configurar domínio (Recomendado)
1. No dashboard do Resend, vá em "Domains"
2. Adicione seu domínio: `bonitoon.com.br`
3. Configure os registros DNS conforme instruções
4. Aguarde verificação (pode levar até 24h)

### 3. Gerar API Key
1. Vá em "API Keys" no dashboard
2. Clique em "Create API Key"
3. Nome: "BonitoON Website"
4. Permissões: "Sending access"
5. Copie a chave gerada

### 4. Configurar variáveis de ambiente
\`\`\`bash
# .env.local
RESEND_API_KEY=re_sua_chave_aqui
CONTACT_EMAIL=contato@bonitoon.com.br
\`\`\`

## 📊 Monitoramento

### Dashboard do Resend
- **Emails enviados**: Acompanhe volume diário
- **Taxa de entrega**: Monitore deliverability
- **Bounces/Spam**: Identifique problemas
- **Logs detalhados**: Debug de problemas

### Logs da aplicação
\`\`\`javascript
// Logs automáticos no console
console.log('Email enviado:', {
  emailId: 'resend_id',
  to: 'contato@bonitoon.com.br',
  contact: 'Nome do cliente',
  timestamp: '2024-01-15T10:30:00Z'
})
\`\`\`

## 🔧 Troubleshooting

### Problemas comuns:

1. **API Key inválida**
   - Verifique se copiou corretamente
   - Confirme se não expirou
   - Teste com curl/Postman

2. **Domínio não verificado**
   - Use `noreply@resend.dev` temporariamente
   - Aguarde verificação DNS
   - Verifique registros SPF/DKIM

3. **Rate limiting**
   - Plano gratuito: 100 emails/dia
   - Plano pago: 50.000+ emails/mês
   - Implemente retry logic

4. **Emails na spam**
   - Configure SPF/DKIM/DMARC
   - Use domínio verificado
   - Evite palavras spam no assunto

## 📈 Melhorias Futuras

### Implementações recomendadas:

1. **Analytics avançado**
   \`\`\`javascript
   // Tracking de conversões
   await analytics.track('contact_form_submitted', {
     source: 'website',
     campaign: 'hero_cta'
   })
   \`\`\`

2. **CRM Integration**
   \`\`\`javascript
   // Enviar para HubSpot/Pipedrive
   await crm.contacts.create({
     name: data.name,
     phone: data.whatsapp,
     source: 'website'
   })
   \`\`\`

3. **A/B Testing**
   \`\`\`javascript
   // Testar diferentes templates
   const template = Math.random() > 0.5 ? 'template_a' : 'template_b'
   await sendEmail({ template, data })
   \`\`\`

## 🔒 Segurança

### Boas práticas:
- ✅ Validação server-side
- ✅ Rate limiting por IP
- ✅ Sanitização de dados
- ✅ Logs de auditoria
- ✅ Variáveis de ambiente seguras

### Rate limiting recomendado:
\`\`\`javascript
// Máximo 3 envios por IP por hora
const rateLimit = {
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 requests
  message: 'Muitas tentativas. Tente novamente em 1 hora.'
}
