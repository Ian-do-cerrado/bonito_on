# Design: Redirecionamento para WhatsApp — Suspensão dos Formulários de Reserva

**Data:** 2026-06-16
**Status:** Aprovado

---

## Objetivo

Substituir todos os formulários de reserva e botões que abrem o `ContactModal` por botões de redirecionamento direto ao WhatsApp, com ícone oficial e mensagens personalizadas por contexto.

---

## Contexto

O site Bonito ON possui um `ContactModal` (formulário com nome + telefone) acionado via `openModal()` em vários pontos da aplicação. A estratégia de conversão muda: o usuário agora é direcionado diretamente ao WhatsApp, eliminando o atrito do formulário.

---

## Escopo

### O que muda

- Suspensão (comentada) do `ContactModal` e de todos os botões que o acionam.
- `ContactForm` é arquivo órfão (não importado em lugar algum) — permanece inalterado.
- Criação de componente compartilhado `WhatsAppCtaButton`.
- Todos os botões de reserva/contato são substituídos por `WhatsAppCtaButton` com mensagens contextuais.
- Ícone do botão WhatsApp no footer atualizado de `MessageCircle` (Lucide genérico) para `FaWhatsapp`.

### O que não muda

- Botão flutuante `WhatsAppButton` — já correto (`FaWhatsapp`, verde, número certo).
- Página `/contato` — já redireciona para WhatsApp.
- Admin, blog, atrações sem botão de reserva.

---

## Componente: `WhatsAppCtaButton`

**Arquivo:** `components/whatsapp-cta-button.tsx`

```tsx
interface WhatsAppCtaButtonProps {
  message: string       // Texto pré-preenchido no WhatsApp
  label?: string        // Default: "Reservar pelo WhatsApp"
  className?: string
}
```

**Comportamento:**
- Link `<a>` apontando para `https://wa.me/5567991395384?text=${encodeURIComponent(message)}`
- `target="_blank" rel="noopener noreferrer"`
- Ícone: `FaWhatsapp` de `react-icons/fa` (já instalado)
- Cor: `bg-[#25D366] hover:bg-[#1ebe5d]` (verde oficial WhatsApp)
- Texto branco, fonte semibold, bordas arredondadas (`rounded-lg`)
- Responsivo: largura 100% por padrão

---

## Arquivos Modificados

### 1. `components/whatsapp-cta-button.tsx` — NOVO

Componente criado conforme spec acima.

### 2. `components/site-layout.tsx`

- Comentar import e renderização do `<ContactModal>`.
- Manter import de `useContactModal` (pode ser necessário em outros usos futuros).

### 3. `components/hero-section.tsx`

- Comentar botão "Fale Conosco" e `useContactModal`.
- Adicionar `<WhatsAppCtaButton>` com:
  - Mensagem: `"Olá! Vim do site Bonito ON e gostaria de mais informações sobre os passeios."`
  - Label: `"Fale Conosco pelo WhatsApp"`
  - Manter estilo `rounded-full`, `size="lg"` para consistência visual da hero.

### 4. `components/tour-card.tsx`

- Comentar botão "Reservar" que chama `openModal()`.
- Substituir pelo `WhatsAppCtaButton` com:
  - Mensagem: `"Olá! Vim do site Bonito ON e gostaria de reservar o passeio ${tour.title}."`
- Atualizar botão "Fale Com um Especialista" existente (já WA mas laranja):
  - Trocar cor laranja por verde `#25D366`.
  - Adicionar `FaWhatsapp` no lugar do texto genérico.

### 5. `components/package-card.tsx`

- Comentar botão "Reservar" que chama `openModal()`.
- Substituir pelo `WhatsAppCtaButton` com:
  - Mensagem: `"Olá! Vim do site Bonito ON e gostaria de reservar o pacote ${title}."`
- Atualizar "Fale Com um Especialista" (já WA mas laranja) — verde + `FaWhatsapp`.

### 6. `components/attraction-detail-page.tsx`

- Comentar botão "Consultar Preços" e `handleReserveClick`.
- Adicionar `WhatsAppCtaButton` no sidebar com:
  - Mensagem: `"Olá! Vim do site Bonito ON e gostaria de mais informações sobre ${attraction.title}."`
- Remover import de `useContactModal`.

### 7. `app/passeios/[slug]/index.tsx`

- Comentar ambos os botões "Reservar Agora" e "Falar com especialista" (ambos chamam `openModal()`).
- Adicionar `WhatsAppCtaButton` com:
  - Mensagem: `"Olá! Vim do site Bonito ON e gostaria de reservar o passeio ${tour.title}."`
  - Label primário: `"Reservar pelo WhatsApp"`.
- Remover import de `useContactModal`.

### 8. `app/pacotes/[slug]/index.tsx`

- Comentar botão "Reservar Agora" que chama `openModal()`.
- Substituir por `WhatsAppCtaButton` com:
  - Mensagem: `"Olá! Vim do site Bonito ON e gostaria de reservar o pacote ${packageData.title}."`
- Atualizar "Fale Com um Especialista" — verde + `FaWhatsapp`.
- Remover import de `useContactModal`.

### 9. `components/TourDetailPage.tsx` (legado)

- Comentar botões "Reservar Agora" e "Falar com um agente" (sem ação alguma).
- Adicionar `WhatsAppCtaButton` com:
  - Mensagem: `"Olá! Vim do site Bonito ON e gostaria de reservar o passeio ${tour.title}."`

### 10. `components/footer.tsx`

- Atualizar botão social de WhatsApp: trocar `MessageCircle` por `FaWhatsapp` de `react-icons/fa`.
- Adicionar import de `FaWhatsapp`.

---

## Mensagens por Contexto

| Local | Mensagem |
|---|---|
| Hero | `Olá! Vim do site Bonito ON e gostaria de mais informações sobre os passeios.` |
| TourCard | `Olá! Vim do site Bonito ON e gostaria de reservar o passeio [tour.title].` |
| PackageCard | `Olá! Vim do site Bonito ON e gostaria de reservar o pacote [title].` |
| Detalhe passeio | `Olá! Vim do site Bonito ON e gostaria de reservar o passeio [tour.title].` |
| Detalhe pacote | `Olá! Vim do site Bonito ON e gostaria de reservar o pacote [packageData.title].` |
| Detalhe atração | `Olá! Vim do site Bonito ON e gostaria de mais informações sobre [attraction.title].` |
| TourDetailPage (legado) | `Olá! Vim do site Bonito ON e gostaria de reservar o passeio [tour.title].` |

---

## Decisões Técnicas

- **`FaWhatsapp`** (react-icons/fa) é o ícone oficial — já em uso no botão flutuante.
- **`#25D366`** é o verde oficial da marca WhatsApp.
- Botões suspensos ficam em comentários JSX `{/* SUSPENDED: <OriginalButton> */}` para reativação futura.
- O `ContactModal` e `ContactForm` não são deletados — apenas comentados/inativos.
- `useContactModal` context e provider permanecem intactos no código.
