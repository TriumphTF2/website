import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";

import { Navbar } from "~/components/Navbar";

export function Layout({ children }: { children: React.ReactNode }) {
  const pages = [
    { href: "/", label: "Home" }
  ]
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
        <Navbar siteTitle="TriumphTF2" items={pages} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
