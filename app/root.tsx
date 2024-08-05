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

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request)
  return {
    theme: getTheme(),
  }
}

// export function Layout({ children }: { children: React.ReactNode }) {
//   const data = useLoaderData<typeof loader>();
//   const [theme] = useTheme();
//   const pages = [
//     { href: "/", label: "Home" },
//     { href: "//bans.triumphtf2.com", label: "Bans" },
//     { href: "//leaderboards.triumphtf2.com", label: "Leaderboards" },
//   ]
//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         <Navbar siteTitle="TriumphTF2" items={pages} />
//         {children}
//         <ScrollRestoration />
//         <Scripts />
//       </body>
//     </html>
//   );
// }

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  const pages = [
    { href: "/", label: "Home" },
    { href: "//bans.triumphtf2.com", label: "Bans" },
    { href: "//leaderboards.triumphtf2.com", label: "Leaderboards" },
  ]
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body className="bg-background dark:bg-foreground">
        <Navbar siteTitle="TriumphTF2" items={pages} />
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
      {/* <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} /> */}
      <App></App>
    </ThemeProvider>
  )
}
