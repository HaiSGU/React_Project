# FoodFast

Client-only demo for food ordering. One monorepo with:
- Mobile app (React Native + Expo).
- Shared library reused by both platforms (hooks · services · utils).
- Optional Web SPA.
- No custom backend. Local persistence only. External Geo APIs (Weather + Geocoding).

## Key Features
- Auth: login, register, logout, change password; client-side session.
- Browse: categories, restaurants, menus.
- Cart & Checkout: quantities, validation, totals, COD.
- Orders: create, list shipping/delivered, update status.
- Geo: pick location on map, reverse geocode, weather by coordinates.
- Offline-first local persistence (AsyncStorage on Mobile; optional localStorage on Web).

## Monorepo Layout
```
React_Project/
├─ Mobile/                     # React Native + Expo app
│  ├─ android/                 # Native Android project
│  ├─ app/ or src/             # Screens/components (your structure)
│  ├─ metro.config.js          # Metro bundler config (watches ../shared)
│  ├─ babel.config.js          # Aliases @shared, @assets
│  └─ package.json
├─ Web/                        # (Optional) React Web SPA (Vite/CRA)
│  ├─ public/
│  ├─ src/
│  └─ package.json
├─ shared/                     # Reused code across platforms
│  ├─ assets/                  # images, fonts
│  ├─ constants/               # lists: categories, restaurants, menus, payments…
│  ├─ context/                 # LocationContext
│  ├─ hooks/                   # useLogin, useRegister, useCheckout, useMapSelect, …
│  ├─ services/                # authService, orderService, weather(Geo)Service
│  ├─ utils/                   # validations, helpers, formatters, builders
│  ├─ theme/                   # colors
│  └─ types/                   # type declarations (optional)
└─ docs/architecture/          # Mermaid/PlantUML diagrams
```

## Architecture (summary)
- Component view: UI (Web/Mobile) requires hooks (IAuthHook, IOrderHook, IGeoHook). Hooks require services (IAuthService, IOrderService, IGeoService). Services require IPersistence and IGeoAPI. Utils are internal.
- Deployment view: 
  - User Device (Browser + localStorage) and Mobile Device (RN runtime + AsyncStorage).
  - Connections via Internet to Geo APIs; optional Static Hosting/CDN for Web bundle.
- No backend/server in current scope.

Diagrams (open with Mermaid/PlantUML):
- docs/architecture/solution-alignment.mmd
- docs/architecture/deployment-current.puml
- docs/architecture/erd.mmd (logical data model – optional)

## Prerequisites
- Node.js 18+ and npm.
- Mobile: Android Studio (SDK/Emulator) or a physical device + Expo.
- Web (optional): any recent browser.
- Windows PowerShell/Command Prompt.

## Setup & Run

### Mobile (React Native + Expo)
```powershell
cd "C:\Users\THIS PC\React_Project\Mobile"
npm install
npx expo start -c
# Press 'a' for Android emulator, or run from Android Studio after:
cd android
.\gradlew clean
```

Aliases and Metro (already expected; adjust if missing):
- babel.config.js maps:
  - @shared → ../shared
  - @assets → ../shared/assets
- metro.config.js watches ../shared so code changes in shared hot-reload.

### Web (optional)
If the Web folder exists:
```powershell
cd "C:\Users\THIS PC\React_Project\Web"
npm install
# Vite:
npm run dev
# CRA:
npm start
```
- Import shared code:
  - Relative: `import x from '../shared/...';`
  - Or set alias in bundler (e.g., Vite resolve.alias: `@shared`, `@assets` → ../shared, ../shared/assets).

## Data Persistence (local only)
- Session keys: `user`, `userInfo`, `isLoggedIn`.
- Orders per user:
  - `shippingOrders_{username}`
  - `deliveredOrders_{username}`
- Mobile: AsyncStorage. Web (if implemented): localStorage.

## Assets (images)
- Use static imports or require with literal paths (no dynamic template strings).
- Respect case sensitivity on Android (prefer lowercase file/folder names).
- Supported formats: .png/.jpg. For .svg use `react-native-svg` + transformer.

## Troubleshooting
- VS Code shows two repos (React_Project & Mobile):
  - Ensure `Mobile\.git` does not exist (nested repo removed).
  - Close extra repo view: Command Palette → “Git: Close Repository”.
- “Nothing to commit”:
  - No tracked changes, or files are ignored (.expo, node_modules, build).
- Image import fails (Android):
  - Check alias config, avoid dynamic require, verify file name case, reset caches:
    ```powershell
    npx expo start -c
    cd android
    .\gradlew clean
    ```
- Clone on a different drive (e.g., D:):
  - Works fine; all paths are relative. Clone the whole repo (keep Mobile and shared siblings).

## Project Scope & Limitations
- Client-only. No multi-device sync. Data lost if storage is cleared.
- Do not store sensitive PII or real passwords (demo/POC).
- External calls limited to Geo APIs (Weather + Geocoding) and optional static hosting for Web.

## Scripts (Mobile)
- Start dev server: `npx expo start -c`
- Clean Android build: `cd android && .\gradlew clean`

## License
TBD.
