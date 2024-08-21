import { Stats, StatsColumns } from "~/typedefs/leaderboards"
import { defer, useLoaderData, Await, type MetaFunction } from "@remix-run/react";
import { DataTable } from "~/components/ui/data-table"
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "~/db/mgemod/schema";
import { themeSessionResolver } from "~/sessions.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: 'TriumphTF2 - Leaderboard' },
        { description: 'TriumphTF2 MGE Mod Leaderboard' },
    ];
};

export async function loader ({ request }: LoaderFunctionArgs) {
    const { getTheme } = await themeSessionResolver(request);
    const connection = await mysql.createConnection({
        host: process.env.MGEMOD_DB_HOST,
        user: process.env.MGEMOD_DB_USER,
        password: process.env.MGEMOD_DB_PASSWORD,
        database: process.env.MGEMOD_DB_NAME,
        port: parseInt(process.env.MGEMOD_DB_PORT ?? "3306"),
    });
    const db = drizzle(connection, {schema, mode: 'default'});
    const stats = await db.select().from(schema.mgemodStats).limit(10);
    // sort by rating
    stats.sort((a, b) => b.rating - a.rating);
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
