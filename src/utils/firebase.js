import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// FIREBASE SETUP: connects this app to YOUR Firebase project.
//
// The values come from the .env file (copy .env.example to .env and fill it in).
// Is it safe to put a Firebase "apiKey" in front-end code? Yes: unlike a
// server secret, it only identifies your project. What actually protects your
// users is the Firebase console (which sign-in methods are enabled, and
// which domains are allowed), not hiding this key.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Fail early with a readable message. Without this, Firebase throws a
// confusing "auth/invalid-api-key" error and the page goes blank.
if (!firebaseConfig.apiKey) {
  throw new Error(
    "Missing REACT_APP_FIREBASE_API_KEY. Copy .env.example to .env, fill in " +
      "your Firebase web app settings, then restart `npm start`."
  );
}

const app = initializeApp(firebaseConfig);

// `auth` is the object every Firebase sign in / sign up / sign out call needs.
// It also remembers the signed-in user in the browser (IndexedDB), which is
// why a user is still logged in after a page refresh.
export const auth = getAuth(app);
