# TriumphTF2 Website
## Powered by these things
- 📖 [Remix docs](https://remix.run/docs)
- 🎮 [GameDig](https://github.com/gamedig/node-gamedig)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🔒 [remix-auth-steam](https://github.com/Andreychik32/remix-auth-steam)

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
# Required for steam login
STEAM_API_KEY=your_steam_api_key
# Informs the application where to redirect after login. NO TRAILING SLASH
BASE_URL=http://localhost:5173
```

## Deployment

Build the Dockerfile

```shellscript
docker build -t ghcr.io/triumph-tf2/website:latest .
```

You should probably use a different tag than latest. You might also want to tweak the docker-compose.yml file to your liking. An example is included [here](docker-compose.yml.example).

## License

Haven't decided yet.
