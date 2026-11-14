# RasoiGrid frontend

React + TypeScript + Vite app for RasoiGrid. See the [main README](../README.md) for setup.

```bash
npm install
cp .env.example .env
npm run dev     # http://localhost:5173
npm run build
npm run lint
```

API calls live in `src/core/api/`: `http.ts` sends requests with the login token, `client.ts` lists the endpoints, and `mappers.ts` converts API data into the shapes the pages use.
