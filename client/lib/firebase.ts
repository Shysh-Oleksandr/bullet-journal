import { type FirebaseApp, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";

import { appConfig } from "@/lib/config";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (
  typeof window !== "undefined" &&
  appConfig.firebase.apiKey
) {
  app = initializeApp(appConfig.firebase);
  auth = getAuth(app);
}

export { app, auth };
