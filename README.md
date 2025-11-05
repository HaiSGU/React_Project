################################################################################
# FoodFast Monorepo                                                             #
################################################################################

FoodFast is a client-only demo platform for restaurant discovery, ordering, and
delivery tracking. The repository hosts both the customer-facing mobile & web
apps plus the shared business logic that powers them. There is **no custom
backend**; all persistence happens locally on the device via AsyncStorage or
`localStorage`, while external geo capabilities rely on public APIs.

--------------------------------------------------------------------------------
Table of Contents
--------------------------------------------------------------------------------
1. [At a Glance](#at-a-glance)
2. [Core Feature Matrix](#core-feature-matrix)
3. [Tech Stack](#tech-stack)
4. [Repository Layout](#repository-layout)
5. [App Roles & Flows](#app-roles--flows)
6. [Client Architecture](#client-architecture)
7. [Data & Persistence](#data--persistence)
8. [Environment & Tooling](#environment--tooling)
9. [Setup Instructions](#setup-instructions)
   - [Mobile (Expo)](#mobile-expo)
   - [Web (Vite)](#web-vite)
10. [Shared Module Usage](#shared-module-usage)
11. [Development Workflow](#development-workflow)
12. [Testing & Quality](#testing--quality)
13. [Building for Release](#building-for-release)
14. [External Services](#external-services)
15. [Troubleshooting](#troubleshooting)
16. [Roadmap & Ideas](#roadmap--ideas)
17. [License](#license)

--------------------------------------------------------------------------------
At a Glance
--------------------------------------------------------------------------------
| Topic              | Notes                                                                 |
|--------------------|-----------------------------------------------------------------------|
| Platforms          | **Mobile:** React Native + Expo Router. **Web:** React + Vite SPA.    |
| Shared code        | Hooks, services, constants, assets, and utils reused across clients.   |
| Data persistence   | Local-only (AsyncStorage / localStorage). Suitable for demos & POCs.   |
| Connectivity       | Weather + geocoding via OpenWeatherMap & OpenStreetMap Nominatim APIs. |
| Auth               | Client-side login/register flows with demo data.                      |
| Ordering           | Menu browsing, cart management, checkout validation, order history.    |
| Operations         | Restaurant dashboard, admin oversight, shipper management.            |

--------------------------------------------------------------------------------
Core Feature Matrix
--------------------------------------------------------------------------------
| Domain              | Capabilities                                                                                  |
|--------------------|------------------------------------------------------------------------------------------------|
| Authentication      | Registration, login, logout, change password, demo shortcuts, client-only session storage.    |
| Browse & Discovery  | Categories, restaurant list, individual menus, search, filters, promotions.                   |
| Cart & Checkout     | Quantity controls, dynamic totals, discount handling, delivery method selection, payment mock.|
| Logistics           | Map-based address picker, weather-aware shipping fees, driver assignment, order status updates.|
| Operations Dashboards| Restaurant owner menu/voucher management, admin global metrics, shipper availability control.|
| Notifications       | Local event bus propagates order events for real-time style UI updates.                       |

--------------------------------------------------------------------------------
Tech Stack
--------------------------------------------------------------------------------
- **Language:** TypeScript/JavaScript (ES2022 modules).
- **Mobile:** Expo SDK 54, React Native 0.81, Expo Router 6.
- **Web:** React 19, Vite 7, React Router 7, Leaflet for maps, Recharts for analytics.
- **Shared:** Plain TypeScript-compatible modules consumed by both clients.
- **Styling:** Tailored CSS for Web; Expo/React Native styling for Mobile.
- **State & Data:** React hooks + local storage abstractions, custom event bus, async services.

--------------------------------------------------------------------------------
Repository Layout
--------------------------------------------------------------------------------
```
React_Project/
├─ Mobile/                     # Expo application
│  ├─ app/                     # Screens & layouts (Expo Router)
│  ├─ components/              # Cross-screen UI components
│  ├─ hooks/, services/        # App-specific logic
│  ├─ android/                 # Gradle project (generated)
│  ├─ scripts/reset-project.js # Convenience script to clear caches
│  ├─ babel.config.js          # Alias @shared, @assets
│  └─ metro.config.js          # Watches ../shared for HMR
├─ Web/                        # React + Vite SPA
│  ├─ src/                     # Pages, components, hooks
│  ├─ public/                  # Static assets
│  ├─ vite.config.js           # Alias setup & dev server config
│  └─ eslint.config.js         # Web lint rules
├─ shared/                     # Platform-agnostic modules
│  ├─ assets/                  # Images, fonts reused by both apps
│  ├─ constants/               # Seed data (menus, drivers, discounts, etc.)
│  ├─ hooks/                   # Auth, checkout, map selection, realtime hooks
│  ├─ services/                # Auth, orders, metrics, weather/geolocation, shipper
│  ├─ utils/                   # Validation, formatters, checkout helpers
│  └─ types/, theme/, config/  # Supporting modules
└─ docs/architecture/          # Mermaid & PlantUML diagrams (optional reference)
```

--------------------------------------------------------------------------------
App Roles & Flows
--------------------------------------------------------------------------------
**Consumer Experience (Mobile & Web)**
- Browse restaurants, menus, and discounts.
- Maintain a cart with quantity adjustments synced to totals.
- Use the checkout flow with inline validation, delivery & payment options.
- Pick a delivery location via Leaflet/Expo maps with reverse geocoding.
- Place orders (stored locally) and view their status.

**Restaurant Owner Dashboard (Web)**
- Authenticate with demo owner credentials.
- Manage menu items (add/edit/delete/toggle availability) saved in `localStorage`.
- Create vouchers, view revenue metrics, monitor incoming orders.

**Admin Dashboard (Web)**
- Monitor system-wide stats (orders, revenue, users, shippers).
- Toggle shipper states (active, busy, suspended) which feed back into checkout driver selection.
- Export CSVs and trigger sync events.

--------------------------------------------------------------------------------
Client Architecture
--------------------------------------------------------------------------------
```text
UI Components (Mobile/Web) → Shared Hooks → Shared Services → Persistence & APIs
```

- **Hooks** encapsulate reusable logic (authentication, checkout, map select).
- **Services** perform I/O (local storage, weather fetch, event bus, metrics sync).
- **Utilities** enforce validation rules (names, phone numbers, addresses) and pricing logic.
- **Event Bus** (`shared/services/eventBus.js`) provides lightweight pub/sub so dashboards react to order changes.

--------------------------------------------------------------------------------
Data & Persistence
--------------------------------------------------------------------------------
- **Storage strategy:**
  - Mobile uses `@react-native-async-storage/async-storage`.
  - Web uses the browser `localStorage`.
- **Key namespaces:**
  - `user`, `userInfo`, `isLoggedIn` for session state.
  - `pendingCheckout` stores a temporary cart when redirecting to login.
  - `activeCheckoutSnapshot` preserves checkout state during map selection.
  - `restaurant_menu_{restaurantId}` keeps owner-added dishes.
  - `orders`, `shippingOrders_{username}`, `deliveredOrders_{username}` track order state.
- **Shipper management:** `shippers` key holds driver status updated by the admin UI; checkout filters to `status === 'active'` only.
- **Important:** Clearing storage resets all demo data. There is no remote sync or multi-device support.

--------------------------------------------------------------------------------
Environment & Tooling
--------------------------------------------------------------------------------
- **Node.js:** 18 or newer recommended for both platforms.
- **Package manager:** npm (default). Yarn/PNPM not configured.
- **Expo CLI:** installed globally via `npx` (Expo SDK 54).
- **Android tooling:** Android Studio or an emulator for native builds (optional).
- **Browsers:** Any Chromium/Firefox/Safari for web development; Vite dev server defaults to port 5173.
- **Linting:** Expo ESLint config for Mobile, custom ESLint via Vite for Web.

--------------------------------------------------------------------------------
Setup Instructions
--------------------------------------------------------------------------------
Clone the repository, then install dependencies per client.

```powershell
git clone <repo-url>
cd "C:\Users\THIS PC\React_Project"
```

### Mobile (Expo)
```powershell
cd Mobile
npm install

# Start development server with cache reset
npx expo start -c

# Launch options while Metro is running:
#   press 'a' for Android emulator
#   press 'w' for web
#   scan QR for a physical device via Expo Go

# Clean native Android build artifacts (if needed)
cd android
.\u0067radlew clean
```

### Web (Vite)
```powershell
cd Web
npm install

# Start in development mode
npm run dev

# Open http://localhost:5173

# Production build preview
npm run build
npm run preview
```

--------------------------------------------------------------------------------
Shared Module Usage
--------------------------------------------------------------------------------
- Mobile `babel.config.js` defines:
  - `@shared` → `../shared`
  - `@assets` → `../shared/assets`
- Web `vite.config.js` mirrors those aliases for consistency.
- When adding new shared files ensure both bundlers can resolve the paths. Avoid dynamic `require` for images; always prefer static imports.

--------------------------------------------------------------------------------
Development Workflow
--------------------------------------------------------------------------------
1. **Initialize shippers & seed data:** first app run invokes `initShippers` and other seed helpers; they write demo data into storage.
2. **Feature coding:** create logic in shared services/hooks when functionality overlaps platforms.
3. **State sync:** use the event bus to broadcast notable changes (e.g., `EVENT_TYPES.ORDER_CREATED`).
4. **Driver availability:** admin toggles update `localStorage.shippers`; checkout automatically filters to active drivers before taking orders.
5. **Map selection:** checkout saves a snapshot before redirecting to `/map-select`; returning restores the cart plus the chosen address.

--------------------------------------------------------------------------------
Testing & Quality
--------------------------------------------------------------------------------
- Automated tests are not included. Manual flows worth exercising:
  - Registration/login and pending checkout redirect handling.
  - Checkout validation (blank inputs, invalid phone/address, no available drivers).
  - Map selection round trip with cart preservation.
  - Admin/restaurant dashboards updating shipper states, menus, vouchers.
- Lint checks:
  - Mobile: `npm run lint` (Expo ESLint).
  - Web: `npm run lint` (Vite ESLint).

--------------------------------------------------------------------------------
Building for Release
--------------------------------------------------------------------------------
- **Mobile:**
  - Configure Expo EAS (not included) or run `npx expo run:android` / `npx expo run:ios` for native builds.
  - Ensure all assets are statically imported and that API keys are moved into env-aware config for production.
- **Web:**
  - `npm run build` outputs static assets in `Web/dist`. Host via any static file service or CDN.
  - Remember the app expects HTTPS when using geolocation APIs in production browsers.

--------------------------------------------------------------------------------
External Services
--------------------------------------------------------------------------------
- **OpenWeatherMap:** `fetchWeather` in `shared/services/weatherService.js` uses a demo API key (`WEATHER_API_KEY`). Replace with your own key and consider moving it to environment variables.
- **OpenStreetMap Nominatim:** Reverse geocoding and search used in map selection.
- **Expo Location / Navigator Geolocation:** Abstracted by `locationService` for mobile/web parity.
- **Leaflet / react-leaflet:** Provides the web map UI.

--------------------------------------------------------------------------------
Troubleshooting
--------------------------------------------------------------------------------
- **Nested Git Repos:** If VS Code shows both root and `Mobile` Git instances, ensure `Mobile/.git` is removed and close extra repo views.
- **Metro cannot resolve shared module:** Check alias configuration and restart Metro with `npx expo start -c`.
- **Images missing (Android):** File names are case-sensitive; run `.\u0067radlew clean` inside `Mobile/android` if caches persist.
- **Map blank on web build:** Leaflet requires `import 'leaflet/dist/leaflet.css';` (already done). Ensure CSS is bundled and served alongside the app.
- **Checkout loses cart when opening map:** A snapshot in `sessionStorage` now preserves state. If it fails, validate session storage availability (some browsers block it in private mode).
- **Driver still assigned after suspension:** Clearing the cached `selectedDriver` and only drawing from active shippers prevents this. Reload checkout after toggling shipper status to refresh the pool.

--------------------------------------------------------------------------------
Roadmap & Ideas
--------------------------------------------------------------------------------
- Extract API keys and base URLs into environment-specific config.
- Add automated unit tests for shared validators and helpers.
- Persist data to a lightweight backend (Firebase/Supabase) for multi-device sync.
- Implement push notifications or WebSockets for real-time order updates.
- Add analytics dashboards for consumer behavior and sales trends.

--------------------------------------------------------------------------------
License
--------------------------------------------------------------------------------
TBD. Replace this section with your chosen license when ready.
