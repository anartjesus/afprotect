# React + Vite

## AFPROTECT — publicação e backoffice

O site inclui um formulário de contacto real e um backoffice em `/admin`.

### Variáveis necessárias na Vercel

Copiar as variáveis de `.env.example` para **Project Settings → Environment Variables**:

- `RESEND_API_KEY`: chave da conta Resend usada para enviar os pedidos;
- `CONTACT_TO_EMAIL`: caixa que recebe os pedidos;
- `CONTACT_FROM_EMAIL`: remetente de um domínio verificado no Resend;
- `ADMIN_PASSWORD`: palavra-passe longa e exclusiva do cliente;
- `SESSION_SECRET`: valor aleatório com pelo menos 32 caracteres;
- `GITHUB_REPO`: `anartjesus/afprotect`;
- `GITHUB_BRANCH`: `main`;
- `GITHUB_TOKEN`: token fine-grained limitado a este repositório, com permissão **Contents: Read and write**.

Depois de adicionar as variáveis, fazer um novo deploy. O formulário envia os pedidos para o endereço configurado. Ao guardar no backoffice, é criado um commit em `public/content.json` e o site passa a ler esse conteúdo através da API, sem depender de um novo deployment. A atualização pode demorar cerca de 30 segundos devido à cache.

### Segurança

Nunca guardar as chaves reais num ficheiro `.env` versionado nem enviá-las por mensagem. A sessão do backoffice é guardada num cookie `HttpOnly`, `Secure` e `SameSite=Strict` com validade de oito horas.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
