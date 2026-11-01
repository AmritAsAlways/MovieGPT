# MovieGPT - development roadmap

Rebuilding https://github.com/akshaymarch7/netflix-gpt one section at a time.
Rule: one section per round. The next section starts only after explicit approval.

## Progress

| # | Section | Status |
|---|---------|--------|
| 1 | Foundation (setup, store skeleton, routing) | DONE |
| 2 | Login / Sign-up UI and validation | DONE |
| 3 | Firebase authentication and auth-driven routing | Waiting for approval |
| 4 | TMDB data layer (Redux + custom hooks) | Pending |
| 5 | Browse page UI | Pending |
| 6 | GPT search (OpenAI + TMDB) and multi-language | Pending |
| 7 | Polish, responsiveness, deployment | Pending |

---

## Phase 1 - What the original project is

**Files inspected in the original repo:** `package.json`, `tailwind.config.js`,
`.gitignore`, `firebase.json`, `public/index.html`, `src/index.js`, `src/App.js`,
`src/index.css`, all 13 files in `src/components/`, all 3 in `src/hooks/`, and
all 9 in `src/utils/`. Not inspected in detail (boilerplate or generated):
`package-lock.json`, `.firebaserc`, `.firebase/` cache, `public/manifest.json`,
`robots.txt`, `reportWebVitals.js`, `setupTests.js`.

**Type of app:** a single-page React app. There is **no custom backend and no
database**. Everything runs in the browser and talks to three outside services.

### External services

| Service | Used for | How we call it |
|---------|----------|----------------|
| Firebase Authentication | Sign up, sign in, sign out, profile name/photo | `firebase` SDK |
| Firebase Hosting | Deploying the built site | `firebase-tools` CLI (Section 7) |
| TMDB (themoviedb.org) | Now-playing, popular, trailers, movie search, poster images | `fetch` + Bearer token |
| OpenAI | Turning a natural-language request into 5 movie names | `openai` SDK |

### Libraries

React 18, react-dom, react-scripts (Create React App), react-router-dom 6,
Redux Toolkit + react-redux, Tailwind CSS 3, firebase 10, openai 4.

### Architecture

```
index.js -> App (Redux <Provider>) -> Body (<RouterProvider>)
                                        |
                  +---------------------+---------------------+
                  | "/"                                       | "/browse"
                Login                                       Browse
                  |  Header                                   |  Header
                  |  form + validate.js                       |  useNowPlayingMovies()  usePopularMovies()
                  |                                           |
                  |                                  showGptSearch ?
                  |                                    |              |
                  |                               GptSearch      MainContainer + SecondaryContainer
                  |                                 SearchBar         VideoTitle, VideoBackground
                  |                                 Suggestions       MovieList -> MovieCard
```

Redux store (4 slices):
- `user`   : `null` or `{ uid, email, displayName, photoURL }`
- `movies` : `{ nowPlayingMovies, popularMovies, trailerVideo }`
- `gpt`    : `{ showGptSearch, movieNames, movieResults }`
- `config` : `{ lang }`

### Data flows

1. **Authentication.** `Login` calls Firebase (create user / sign in). Firebase
   remembers the session. `Header` registers `onAuthStateChanged` once; when it
   reports a user, Header dispatches `addUser` and navigates to `/browse`; when
   it reports no user, Header dispatches `removeUser` and navigates to `/`. So
   the redirect logic lives in one place and also handles page refreshes.
2. **Browse data.** `Browse` mounts -> custom hooks run `useEffect` -> `fetch`
   TMDB -> `dispatch(addNowPlayingMovies(...))` -> store updates -> components
   using `useSelector` re-render with data. The hooks skip the fetch if the
   data is already in the store (a simple cache).
3. **Trailer.** `MainContainer` takes the first now-playing movie, passes its id
   to `VideoBackground`, whose hook `useMovieTrailer` fetches that movie's
   videos, picks a trailer and stores it. An `<iframe>` embeds the YouTube
   video with autoplay and mute.
4. **GPT search.** User types a request -> `GptSearchBar` asks OpenAI for 5 movie
   names (comma separated) -> splits into an array -> searches TMDB once per
   name with `Promise.all` -> dispatches names + results to the `gpt` slice ->
   `GptMovieSuggestions` renders one `MovieList` per name.

### Purpose of each file

| File | Purpose |
|------|---------|
| `src/index.js` | Entry point, mounts React |
| `src/App.js` | Wraps the app in the Redux Provider |
| `components/Body.js` | Router and route table |
| `components/Header.js` | Top bar; auth listener, sign out, GPT toggle, language picker |
| `components/Login.js` | Sign in / sign up form |
| `components/Browse.js` | Page shell after login; starts data hooks; switches normal view / GPT view |
| `components/MainContainer.js` | Picks the featured movie |
| `components/VideoTitle.js` | Featured movie title, overview, buttons |
| `components/VideoBackground.js` | Embedded autoplay trailer |
| `components/SecondaryContainer.js` | The rows of movie lists |
| `components/MovieList.js` | One titled horizontal row |
| `components/MovieCard.js` | One poster image |
| `components/GptSearch.js` | GPT page layout |
| `components/GptSearchBar.js` | Input + OpenAI + TMDB search logic |
| `components/GptMovieSuggestions.js` | Renders GPT results |
| `hooks/useNowPlayingMovies.js` | Fetch now-playing into the store |
| `hooks/usePopularMovies.js` | Fetch popular into the store |
| `hooks/useMovieTrailer.js` | Fetch a movie's trailer into the store |
| `utils/appStore.js` | Redux store |
| `utils/userSlice.js`, `moviesSlice.js`, `gptSlice.js`, `configSlice.js` | State slices |
| `utils/constants.js` | URLs, API options, language list |
| `utils/languageConstants.js` | Translated UI strings |
| `utils/validate.js` | Email and password checks |
| `utils/firebase.js` | Firebase init, exports `auth` |
| `utils/openai.js` | OpenAI client |

---

## Phase 2 - Sections

### Section 1 - Foundation  (DONE)
- **Built:** project config, Tailwind, folder structure, constants, `.env.example`, Redux store with `user` slice, router with two placeholder routes, `Header` wordmark.
- **Files:** `package.json`, `tailwind.config.js`, `.gitignore`, `.env.example`, `README.md`, `PLAN.md`, `public/index.html`, `src/index.js`, `index.css`, `App.js`, `components/{Body,Header,Login,Browse}.js`, `utils/{appStore,userSlice,constants}.js`.
- **Tech:** Create React App, Tailwind, Redux Toolkit, React Router.
- **Connects:** everything later plugs into this store, router and header.
- **Learn:** how a CRA project boots, Redux Provider and slices, route tables, env variables.

### Section 2 - Login / Sign-up UI and validation  (DONE)
- **Built:** exactly as listed below. Extras: unit tests for the validator, and the error message clears when you switch between Sign In and Sign Up.
- **Build:** the full Login page UI and the form logic, with no network calls yet.
- **Features:** sign in / sign up toggle, name field only on sign up, email + password validation, error message under the form, full-screen background, responsive card.
- **Files:** modify `Login.js`; create `utils/validate.js`.
- **Tech:** `useState`, `useRef`, regular expressions, Tailwind.
- **Connects:** Section 3 adds the Firebase calls inside the click handler written here.
- **Learn:** controlled state vs `useRef`, form handling with `preventDefault`, conditional rendering, regex validation.

### Section 3 - Firebase authentication
- **Build:** real accounts and auth-driven navigation.
- **Features:** create account, sign in, sign out, save display name and avatar, redirect `/` <-> `/browse` automatically, user avatar and Sign Out in the header.
- **Files:** create `utils/firebase.js`; modify `Login.js`, `Header.js`.
- **Tech:** Firebase Auth, `useEffect`, `useNavigate`, `useDispatch`, `useSelector`.
- **Connects:** fills `userSlice` from Section 1; the redirects protect the pages built in Sections 4-6.
- **Learn:** `useEffect` cleanup (unsubscribe), observer pattern (`onAuthStateChanged`), async promises, single-source-of-truth for auth.
- **You must do:** create a free Firebase project, enable Email/Password sign-in, and put its web config in `.env`.

### Section 4 - TMDB data layer
- **Build:** the data plumbing for the Browse page.
- **Features:** now-playing and popular movie lists and the featured trailer stored in Redux, with simple "do not refetch" caching.
- **Files:** create `utils/moviesSlice.js`, `hooks/useNowPlayingMovies.js`, `usePopularMovies.js`, `useMovieTrailer.js`; modify `appStore.js`, `Browse.js`.
- **Tech:** `fetch`, async/await, custom hooks, Redux slices.
- **Connects:** Section 5 renders this data; Section 6 reuses the TMDB options.
- **Learn:** what a custom hook is and why, `useEffect` with an empty dependency array, API auth headers, normalizing API data into a store.
- **You must do:** create a free TMDB account and copy the "API Read Access Token" into `.env`.

### Section 5 - Browse page UI
- **Build:** the Netflix-style home screen.
- **Features:** featured movie with autoplaying muted trailer behind the title and overview, rows of posters (Now Playing, Trending, Popular, Upcoming, Horror) that scroll sideways.
- **Files:** create `MainContainer.js`, `VideoTitle.js`, `VideoBackground.js`, `SecondaryContainer.js`, `MovieList.js`, `MovieCard.js`; modify `Browse.js`.
- **Tech:** `useSelector`, component composition, props, Tailwind layout and gradients, YouTube embed.
- **Connects:** consumes Section 4 data; its `MovieList` is reused by Section 6.
- **Learn:** container vs presentational components, reading Redux state, layering with absolute positioning, responsive Tailwind (`md:`).

### Section 6 - GPT search and multi-language
- **Build:** AI movie recommendations.
- **Features:** "GPT Search" toggle, search bar, OpenAI returns 5 movie names, TMDB looked up for each, results shown in rows; English / Hindi / Spanish UI text.
- **Files:** create `utils/gptSlice.js`, `configSlice.js`, `languageConstants.js`, `openai.js`, `components/{GptSearch,GptSearchBar,GptMovieSuggestions}.js`; modify `appStore.js`, `Header.js`, `Browse.js`.
- **Tech:** OpenAI SDK, `Promise.all`, Redux, `useRef`.
- **Connects:** reuses `MovieList` and the TMDB options.
- **Learn:** prompt design, parallel async requests, chaining two APIs, i18n with a lookup object.
- **Important:** a key used in the browser is visible to users. We follow the original for learning, but I will explain the risk and the safer alternative (a small server that holds the key).
- **You must do:** an OpenAI API key with billing enabled.

### Section 7 - Polish and deployment
- **Build:** production readiness.
- **Features:** responsive fixes, `useMemo` / memoization where it helps, error handling for failed API calls, final README, Firebase Hosting config and deploy steps.
- **Files:** touch many components; create `firebase.json`, `.firebaserc`.
- **Tech:** `React.memo` / `useMemo`, Firebase Hosting.
- **Learn:** performance basics, error states, build and deploy workflow.

---

## Known issues in the original (code-review notes)

1. "Trending", "Upcoming" and "Horror" rows all reuse the now-playing list; only "Popular" has its own data. We will mirror this first, then decide whether to fetch real data in Section 7.
2. `useEffect` hooks use empty dependency arrays while reading outside values (ESLint warns). Fine here, and explained where it appears.
3. GPT results are split with `split(",")` and not trimmed, and there is no error handling if OpenAI fails.
4. The OpenAI key is used directly in the browser (`dangerouslyAllowBrowser`).
5. Firebase web config is hard-coded in the original; we use `.env`.
6. The original uses Netflix's logo and background image; we use a text wordmark and gradient. Say so if you want the original assets instead.

## Section 1 - testing log

- `npm install`: OK (1390 packages).
- `CI=true npm run build`: compiled successfully, no lint warnings.
- Not run on your machine (I cannot run `npm` there); see README for the commands.

## Section 2 - testing log

- `CI=true npm test -- --watchAll=false`: 5 of 5 validator tests pass.
- `CI=true npm run build`: compiled successfully, no lint warnings.
- Headless Chromium against the production build: invalid email shows "Email ID is not valid"; weak password shows the password message; toggling to Sign Up adds the Full Name field and clears the error; valid input shows no error; no horizontal scroll at 390px wide; `/browse` still loads; no console errors.
- Known limitations: valid input does nothing yet (Firebase arrives in Section 3); the Full Name field is not validated, same as the original; the Login component itself has no automated test (only `validate.js` does).
- Not run on your machine (I cannot run `npm` there).
