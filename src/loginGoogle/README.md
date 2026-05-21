# Login Google PWA — React + TypeScript + Vite

PWA com autenticação Google via Firebase, validando funcionamento em desktop, Android (Chrome), iPhone (Safari) e PWA instalado em ambos.

## Stack

- React 18 + TypeScript + Vite
- React Router DOM
- Styled Components
- Firebase Authentication + Firestore
- React Toastify
- vite-plugin-pwa (manifest + service worker + offline básico)

## Estrutura

```
src/
├── app/                # bootstrap React (App.tsx)
├── providers/          # AuthProvider
├── routes/             # AppRoutes
├── layouts/            # AuthLayout, AppLayout
├── auth/               # AuthService, GoogleAuthService, SessionService, AuthLogger, AuthErrorMapper, ProtectedRoute
├── components/         # UI + DebugPanel + InstallPrompt
├── contexts/           # AuthContext
├── hooks/              # useAuth, usePlatform, useInstallPrompt
├── services/           # (reservado)
├── useCases/           # loginWithGoogle, loginWithEmail, registerWithEmail, logout
├── mappers/            # userMapper
├── utils/              # platform, storage
├── types/              # auth
├── pages/
│   ├── principal/
│   ├── login/
│   └── cadastro/
├── styles/             # theme + global
└── database/           # firebase.ts
```

## Configuração

1. Instale dependências:
   ```bash
   npm install
   ```
2. Crie `.env` baseado em `.env.example` com as chaves do seu projeto Firebase.
3. No console do Firebase, ative **Google Sign-In** e adicione domínios em **Authorized Domains**:
   - `localhost`
   - seu domínio de produção
   - subdomínio PWA (se houver)

## Scripts

```bash
npm run dev       # desenvolvimento (host habilitado para teste em celular na mesma rede)
npm run build     # build de produção
npm run preview   # preview do build (use --host para celular)
npm run lint      # tsc --noEmit
```

## Estratégia OAuth

- Desktop → `signInWithPopup`
- Mobile (Android / iOS) → `signInWithRedirect`
- Detecção automática via `utils/platform.ts`
- Em caso de popup bloqueado, faz fallback automático para redirect
- Persistência: `browserLocalPersistence`
- Restauração de sessão no boot via `getRedirectResult` + `onAuthStateChanged`

## PWA

- `manifest.json` gerado pelo `vite-plugin-pwa`
- Service worker com `autoUpdate`
- Instalação Android via `beforeinstallprompt` (banner nativo)
- Instalação iOS via guia visual no Safari (modal “Adicionar à Tela de Início”)
- Detecção de modo `standalone` esconde o prompt automaticamente

## Debug

A página de login/cadastro/principal exibe um **DebugPanel** com:
estratégia, plataforma, navegador, modo standalone, usuário, provider, redirect pendente, sessão restaurada, URL e logs do `AuthLogger`.

## Ícones PWA

Os arquivos `pwa-192x192.png`, `pwa-512x512.png` e `apple-touch-icon.png` devem ser colocados em `public/`. Não foram incluídos por serem binários — gere a partir de qualquer ícone (ex.: https://realfavicongenerator.net/).
