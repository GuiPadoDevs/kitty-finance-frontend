# 🎀 Finanças da Sah — Frontend (Hello Kitty Edition)

Aplicativo PWA e Web App para organização e controle financeiro pessoal, desenvolvido com Vue 3, TypeScript, Tailwind CSS e Pinia, com temática Hello Kitty.

---

## 🌸 Tecnologias

- **Vue 3** (`<script setup>`, Composition API)
- **TypeScript**
- **Vite**
- **Pinia** (Gerenciamento de Estado)
- **Vue Router 4**
- **Tailwind CSS** (Paleta de cores customizada Hello Kitty)
- **Vite PWA** (`vite-plugin-pwa` para instalação no celular iOS/Android)
- **Lucide Icons**

---

## 🚀 Como Executar Localmente

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

3. **Iniciar servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse em: `http://localhost:5173`

4. **Build para produção:**
   ```bash
   npm run build
   ```

---

## ☁️ Deploy na Vercel

1. Importe o repositório `kitty-finance-frontend` no painel da **[Vercel](https://vercel.com)**.
2. Defina a variável de ambiente:
   - `VITE_API_URL`: URL da sua API Backend (ex: `https://kitty-finance-api.onrender.com/api/v1` ou sua URL Vercel).
3. Clique em **Deploy**! 🚀
