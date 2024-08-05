import { createThemeSessionResolver } from "remix-themes"
import { createCookieSessionStorage } from "@remix-run/node"


// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production"

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["its845andtheyhavenotreadiedupyet"],
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "triumphtf2.com", secure: true }
      : {}),
  }
})

export const steamSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secrets: ["its845andtheyhavenotreadiedupyet"],
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "triumphtf2.com", secure: true }
      : {}),
    }
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
export const {getSession, commitSession, destroySession} = steamSessionStorage;
