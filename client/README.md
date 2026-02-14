# Bullet Journal – Next.js 16 PWA (client)

This is the new Next.js 16 PWA that will replace the old React (CRA) frontend in `bullet-journal/frontend`. It is a minimal installable PWA with no feature modules in the initial setup.

## Tech stack

- **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS**
- **TanStack Query**, **Firebase**, **axios** are installed for future use (auth, API calls, server state). No providers or implementation in this phase.

## Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see "Hello World!".

**Build for production:**

```bash
npm run build
npm run start
```

## Testing "Add to Home Screen"

The app is installable as a PWA (no service worker; manifest + icons only).

1. **Desktop (Chrome/Edge):** Open the app on localhost or over HTTPS. Use the install icon in the address bar or the browser menu to install.
2. **Mobile:** Serve over HTTPS (or use localhost if your device can reach it). In Safari (iOS): Share → "Add to Home Screen". In Chrome (Android): menu → "Add to Home Screen" or "Install app".

Ensure the manifest and icons load (e.g. DevTools → Application → Manifest).

## Environment

Copy `.env.example` to `.env.local` and fill in Firebase and API URL when you add auth and API integration.
