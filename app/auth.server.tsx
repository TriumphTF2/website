import { Authenticator } from "remix-auth";
import { steamSessionStorage } from "./sessions.server";
import { SteamStrategy, SteamStrategyVerifyParams } from "remix-auth-steam";

export type User = SteamStrategyVerifyParams;

export const authenticator = new Authenticator<User>(steamSessionStorage);

authenticator.use(
    new SteamStrategy(
        {
            returnURL: `${process.env.BASE_URL || 'http://localhost:5173'}/auth/steam/callback`,
            apiKey: process.env.STEAM_API_KEY! as string,
        }, async (user) => user
    )
);
