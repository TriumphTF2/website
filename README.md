# TriumphTF2 Website
## Powered by Remix and GameDig
- 📖 [Remix docs](https://remix.run/docs)
- 🎮 [GameDig](https://github.com/gamedig/node-gamedig)

## Getting Started

```shellscript
npm install --legacy-peer-deps
```

You need to include --legacy-peer-deps because [remix-auth-steam](https://github.com/Andreychik32/remix-auth-steam) is largely unmaintained.

## Development

Run the dev server:

```shellscript
npm run dev
```

Note - For steam logins you need an API key. You can get one [here](https://steamcommunity.com/dev/apikey).

## Env Variables

```shellscript
# .env
# Required for steam login
STEAM_API_KEY=your_steam_api_key
# Informs the application where to redirect after login. NO TRAILING SLASH
BASE_URL=http://localhost:5173
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
