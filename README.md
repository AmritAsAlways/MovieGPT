# MovieGPT

A Netflix-style movie app with AI-powered movie search, built section by section.
See [PLAN.md](PLAN.md) for the roadmap and progress.

## Run it

```bash
npm install
copy .env.example .env     # Windows (macOS/Linux: cp .env.example .env)
# ...fill in .env (see "Firebase setup" below), then:
npm start                  # http://localhost:3000
npm test                   # unit tests
```

Restart `npm start` every time you edit `.env`.

## Firebase setup (needed from Section 3)

1. Go to https://console.firebase.google.com and create a project (Analytics can be off).
2. **Build > Authentication > Get started > Sign-in method**: enable **Email/Password**.
3. **Project settings (gear icon) > General > Your apps > Web (`</>`)**: register a web app.
   Firebase shows a `firebaseConfig` object.
4. Copy each value into `.env`:

   | firebaseConfig key | `.env` variable |
   |---|---|
   | `apiKey` | `REACT_APP_FIREBASE_API_KEY` |
   | `authDomain` | `REACT_APP_FIREBASE_AUTH_DOMAIN` |
   | `projectId` | `REACT_APP_FIREBASE_PROJECT_ID` |
   | `storageBucket` | `REACT_APP_FIREBASE_STORAGE_BUCKET` |
   | `messagingSenderId` | `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` |
   | `appId` | `REACT_APP_FIREBASE_APP_ID` |

5. Restart `npm start`. If you skip this, the app shows an error that names the missing variable.

## TMDB setup (needed from Section 4)

1. Create a free account at https://www.themoviedb.org and verify your email.
2. Go to https://www.themoviedb.org/settings/api and request an API key (choose the "Developer" option; the form asks for a short app description, e.g. a personal learning project).
3. Copy the **API Read Access Token** (the very long one, NOT the shorter "API Key") into `.env` as `REACT_APP_TMDB_KEY`.
4. Restart `npm start`.

On `/browse` you should see how many now-playing and popular movies loaded. If it stays on "loading...", open the browser console (F12): a message such as `TMDB now_playing failed: 401 Invalid API key` means the token in `.env` is wrong or missing.

## Routes

- `/` sign in / sign up. Signed-in users are sent to `/browse`.
- `/browse` the movie page. Signed-out users are sent to `/`.

Never commit `.env`.
