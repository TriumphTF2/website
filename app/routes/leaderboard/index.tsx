import { Stats, StatsColumns } from "~/typedefs/leaderboards"
import { defer, useLoaderData, Await, type MetaFunction } from "@remix-run/react";
import { DataTable } from "~/components/ui/data-table"
import { drizzle } from "drizzle-orm/mysql2";
// import { count } from "drizzle-orm";
import mysql from "mysql2/promise";
import * as schema from "~/db/mgemod/schema";
import { themeSessionResolver } from "~/sessions.server";
import { LoaderFunctionArgs } from "@remix-run/node";
// import { gt } from "drizzle-orm";

export const meta: MetaFunction = () => {
    return [
        { title: 'TriumphTF2 - Leaderboard' },
        { description: 'TriumphTF2 MGE Mod Leaderboard' },
    ];
};

export async function loader ({ request }: LoaderFunctionArgs) {
    const { getTheme } = await themeSessionResolver(request);
    const url = new URL(request.url);
    const search = url.searchParams;
    const queryParams = {
        limit: parseInt(search.get('l') ?? "10"),
        page: parseInt(search.get('p') ?? "1"),
        // age: parseInt(search.get('a') ?? "60"),
    }

    // guard rails
    isNaN(queryParams.limit) && (queryParams.limit = 50);
    isNaN(queryParams.page) && (queryParams.page = 1);
    // isNaN(queryParams.age) && (queryParams.age = 60);

    // const now = Date.now() / 1000;
    // const age = now - (queryParams.age * 86400);

    const offset = (queryParams.page - 1) * queryParams.limit;

    const connection = await mysql.createConnection({
        host: process.env.MGEMOD_DB_HOST,
        user: process.env.MGEMOD_DB_USER,
        password: process.env.MGEMOD_DB_PASSWORD,
        database: process.env.MGEMOD_DB_NAME,
        port: parseInt(process.env.MGEMOD_DB_PORT ?? "3306"),
    });
    const db = drizzle(connection, {schema, mode: 'default'});
    const stats = await db.select({
        id: schema.leaderboard.id,
        rating: schema.leaderboard.rating,
        steamid: schema.leaderboard.steamid,
        name: schema.leaderboard.name,
        wins: schema.leaderboard.wins,
        losses: schema.leaderboard.losses,
        lastplayed: schema.leaderboard.lastplayed,
        hitblip: schema.leaderboard.hitblip,
        rank: schema.leaderboard.rank,
    }).from(schema.leaderboard)
        // .where(gt(schema.leaderboard.lastplayed, age))
        .offset(offset)
        .limit(queryParams.limit);
    if (stats.length == 0) {
        connection.destroy();
        return defer({
            theme: getTheme(),
            stats: [],
        });
    }
    connection.destroy();
    return defer({
        theme: getTheme(),
        stats: stats as Stats[],
    });
}

export default function Leaderboard() {
    // const stats = getData();
    const data = useLoaderData<typeof loader>();
    return (
        <div className="container mx-auto py-10">
            <Await resolve={data.stats}>
                <DataTable className={data.theme?.toString()} columns={StatsColumns} data={data.stats} />
            </Await>
        </div>
    )
}
