import clsx from "clsx";
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from "remix-themes";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";

import { themeSessionResolver } from "./sessions.server";

import { Navbar } from "~/components/Navbar";
import { LoaderFunctionArgs } from "@remix-run/node";
// import { Stars, defaultStars } from "~/components/Stars";

import { authenticator } from "~/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request)
  const auth = await authenticator.isAuthenticated(request);
  return {
    theme: getTheme(),
    auth: auth,
  }
}

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  const pages = [
    { href: "/", label: "Home" },
    { href: "bans", label: "Bans" },
    // { href: "leaderboard", label: "Leaderboards" },
    { href: "//discord.com/invite/g53the6dfM", label: "Discord", target:"_blank" },
  ]
  return (
    <html lang="en" data-theme={clsx(theme)} className={clsx(theme) + ''}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body className={`${clsx(theme)} bg-zinc-950 text-primary-foreground dark:bg-zinc-50 dark:text-secondary-foreground`}>
        <Navbar siteTitle="TriumphTF2" items={pages} user={data.auth} />
        {/* <Stars {...defaultStars} /> */}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  )
}
