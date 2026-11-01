# MovieGPT

A Netflix-style movie app with AI-powered movie search, built section by section.
See [PLAN.md](PLAN.md) for the roadmap and progress.

## Run it

```bash
npm install
cp .env.example .env     # on Windows: copy .env.example .env
npm start
```

Open http://localhost:3000. Routes available so far: `/` (login) and `/browse`.

## Environment variables

Fill these in `.env` as each section needs them. See `.env.example` for the full list.
Never commit `.env`.
