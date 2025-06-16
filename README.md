# 🌿 BonitoON - Turismo em Bonito MS

Uma plataforma moderna de turismo para Bonito, Mato Grosso do Sul, construída com Next.js 15 e React 19.

## ✨ Características

- 🚀 **Next.js 15** com App Router
- ⚛️ **React 19** com Server Components
- 🎨 **Tailwind CSS** para estilização
- 📱 **Design Responsivo** para todos os dispositivos
- 🌐 **Internacionalização** (PT/EN)
- 📧 **Sistema de Email** com Resend
- 🎭 **Animações Suaves** e micro-interações
- 🔍 **SEO Otimizado** com metadata dinâmica
- ⚡ **Performance Otimizada** com lazy loading
- 🛡️ **TypeScript** para type safety

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18.17.0 ou superior
- npm, yarn ou pnpm

### Instalação

1. **Clone o repositório**
\`\`\`bash
git clone https://github.com/seu-usuario/bonito-travel-agency.git
cd bonito-travel-agency
\`\`\`

2. **Instale as dependências**
\`\`\`bash
npm install
# ou
yarn install
# ou
pnpm install
\`\`\`

3. **Configure as variáveis de ambiente**
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edite o arquivo `.env.local` com suas credenciais:
\`\`\`env
RESEND_API_KEY=seu_resend_api_key
CONTACT_EMAIL=contato@bonitoon.com.br
SEND_AUTO_REPLY=true
TWILIO_SID=seu_twilio_sid
TWILIO_TOKEN=seu_twilio_token
\`\`\`

4. **Execute o servidor de desenvolvimento**
\`\`\`bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
\`\`\`

5. **Abra no navegador**
\`\`\`
http://localhost:3000
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
bonito-travel-agency/
├── app/                    # App Router (Next.js 15)
│   ├── (pages)/           # Páginas agrupadas
│   ├── actions/           # Server Actions
│   ├── api/              # API Routes
│   ├── globals.css       # Estilos globais
│   └── layout.tsx        # Layout raiz
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── ...               # Componentes específicos
├── contexts/             # React Contexts
├── hooks/                # Custom Hooks
├── lib/                  # Utilitários
├── public/               # Arquivos estáticos
├── types/                # Definições TypeScript
└── docs/                 # Documentação
\`\`\`

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa ESLint
- `npm run type-check` - Verifica tipos TypeScript

## 🎨 Tecnologias Utilizadas

### Core
- **Next.js 15** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Linguagem tipada
- **Tailwind CSS** - Framework CSS

### UI/UX
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Framer Motion** - Animações
- **shadcn/ui** - Sistema de design

### Funcionalidades
- **Resend** - Serviço de email
- **Twilio** - SMS (opcional)
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas

## 🌐 Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório no Vercel**
2. **Configure as variáveis de ambiente**
3. **Deploy automático** a cada push

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📧 Configuração de Email

1. **Crie uma conta no Resend**
2. **Obtenha sua API Key**
3. **Configure o domínio** (opcional)
4. **Adicione as variáveis** no `.env.local`

## 🔧 Personalização

### Cores e Tema
Edite `tailwind.config.ts` para personalizar:
- Cores da marca
- Tipografia
- Espaçamentos
- Animações

### Conteúdo
- **Passeios**: `app/passeios/`
- **Pacotes**: `app/pacotes/`
- **Blog**: `app/blog/`
- **Atrações**: Componente `AttractionsSection`

### Idiomas
Adicione novos idiomas em `contexts/language-context.tsx`

## 🐛 Solução de Problemas

### Erro de Build
\`\`\`bash
npm run type-check
npm run lint
\`\`\`

### Problemas de Dependências
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Problemas de Cache
\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

## 📈 Performance

- ✅ **Core Web Vitals** otimizados
- ✅ **Lazy Loading** de imagens
- ✅ **Code Splitting** automático
- ✅ **Server Components** quando possível
- ✅ **Otimização de fontes** com next/font

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Email**: contato@bonitoon.com.br
- **Website**: https://bonitoon.com.br
- **Issues**: GitHub Issues

---

Feito com ❤️ para promover o turismo em Bonito, MS
