import { useLoaderData, defer, Await, type MetaFunction, Link } from "@remix-run/react";
import { Suspense, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { themeSessionResolver } from "~/sessions.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { ThemeProvider } from "remix-themes";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "~/db/sourcebans/schema";
import { type BanProps, BanDetailsCard, BanDetailsSkeleton } from "~/components/bans/BanDetailsCard";
import { banLengthParse, banStatusToString, banProcessExpiration, steamidConvert32, steamidConvert64 } from "~/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
// import { ClientOnly } from "remix-utils/client-only";
// import { ProgressiveClientOnly } from "~/components/ProgressiveClientOnly";


export const meta: MetaFunction = () => {
    return [
        { title: "TriumphTF2 - Bans" },
        { name: "description", content: "TriumphTF2 Bans Page" },
    ];
};


export async function loader({ request }: LoaderFunctionArgs) {

    const { getTheme } = await themeSessionResolver(request)
    const connection = await mysql.createConnection({
        host: process.env.SOURCEBANS_DB_HOST,
        user: process.env.SOURCEBANS_DB_USER,
        password: process.env.SOURCEBANS_DB_PASSWORD,
        database: process.env.SOURCEBANS_DB_NAME,
        port: parseInt(process.env.SOURCEBANS_DB_PORT ?? "3306"),
    });
    const db = drizzle(connection, { schema, mode: 'default' });
    const bans = await db.select().from(schema.sbBans);
    // reverse order of bans
    bans.reverse();
    const admins = await db.select({
        aid: schema.sbAdmins.aid,
        user: schema.sbAdmins.user,
    }).from(schema.sbAdmins);
    const aliases = await db.select().from(schema.sbBanlog);
    const users = [] as { user: string, avatar: string }[];
    const sids = [] as string[];
    for (const ban of bans) {
        if (ban.authid && users.filter(user => user.user == ban.authid).length == 0) {
            users.push({ user: ban.authid, avatar: '' });
            sids.push(steamidConvert64(ban.authid));
        }
    }
    while (sids.length > 0) {
        // fetch 100 users at a time
        const lsids = sids.filter((sid, index) => index < 50);
        let reqstring = ''
        lsids.forEach((v, i) => {
            if (i == 0) {
                reqstring += `${v}`;
            } else {
                reqstring += `,${v}`;
            }
            const index = sids.indexOf(v);
            sids.splice(index, 1);
        });
        const response = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${reqstring}`);
        const data = await response.json();
        const players = data.response.players;
        if (players.length == 0) continue;
        for (const player of players) {
            const sid = steamidConvert32(player.steamid);
            const user = users.findIndex((user) => user.user == sid);
            if (user !== -1) {
                users[user].avatar = player.avatarfull;
            }
        }

    }
    connection.destroy();
    return defer({
        theme: getTheme(),
        bans: bans,
        admins: admins,
        aliases: aliases,
        avatars: users,
    });
}

export default function Bans() {
    const data = useLoaderData<typeof loader>();
    const [clickedRow, setClickedRow] = useState<BanProps | null>(null);
    const handleRowClick = (ban: BanProps) => {
        return () => {
            setClickedRow(ban);
        }
    }

    const timestampToDateTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString();
    }

    return (
        <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
            <div>
                <div className="container mx-auto py-4">
                    <h1 className="text-4xl font-bold dark:text-primary text-secondary py-4"><Link to="https://bans.triumphtf2.com/">Click here to go to the classic Bans page</Link></h1>
                    <div className='flex gap-8'>
                        <div className="flex-1">
                            <Table className="">
                                <TableHeader className="bg-primary text-white font-bold">
                                    <TableRow className="hover:bg-primary">
                                        <TableHead className="text-primary-foreground font-bold uppercase"></TableHead>
                                        <TableHead className="text-primary-foreground font-bold uppercase">Player</TableHead>
                                        <TableHead className="text-primary-foreground font-bold uppercase">Listed</TableHead>
                                        <TableHead className="text-primary-foreground font-bold uppercase">Length</TableHead>
                                        <TableHead className="text-primary-foreground font-bold uppercase">Expires</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="max-h-screen overflow-scroll">
                                    <Suspense>
                                        <Await resolve={data.bans as BanProps[]}>
                                            {data.bans.length > 0 && data.bans.map((ban, index) => (
                                                <TableRow key={ban.bid} onClick={handleRowClick(ban)} className={`cursor-pointer ${clickedRow && ban == clickedRow ? 'bg-yellow-200 hover:bg-yellow-100' : index % 2 === 0 ? 'bg-muted hover:bg-primary-foreground' : 'bg-background hover:bg-primary-foreground'} `}>
                                                    <TableCell className="text-primary">
                                                        <Avatar>
                                                            <AvatarImage src={data.avatars.filter(avatar => avatar.user == ban.authid)[0].avatar} alt={`Avatar for ${ban.name}`}></AvatarImage>
                                                            <AvatarFallback className="bg-muted-foreground">{ban.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell className="text-primary">
                                                        <div className="flex flex-row">
                                                            <span className="flex-1">{ban.name}</span>
                                                            <span className="text-sm text-muted-foreground">{ban.authid}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-primary">
                                                        <Suspense fallback="Loading...">
                                                            {timestampToDateTime(ban.created)}
                                                        </Suspense>
                                                    </TableCell>
                                                    <TableCell className={`${ban.length > 0 ? 'text-muted-foreground' :
                                                        ban.length === 0 ? 'text-red-500' : 'text-primary'
                                                        } font-bold`}>{banStatusToString(banLengthParse(ban))}</TableCell>
                                                    <TableCell className={`${ban.removeType === null && ban.length > 0 ? 'text-orange-500' :
                                                        ban.removeType === null && ban.length === 0 ? 'text-red-500' :
                                                            ban.removeType === 'E' ? 'text-blue-500' : ban.removeType === 'U' ? 'text-green-500' :
                                                                'text-blue-500'
                                                        } font-bold`}>
                                                        <Suspense fallback="Loading...">
                                                            {banProcessExpiration(ban)}
                                                        </Suspense>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </Await>
                                    </Suspense>
                                </TableBody>
                            </Table>
                        </div>
                        {clickedRow && (
                            <BanDetailsCard
                                ban={clickedRow}
                                admin={data.admins.filter(admin => admin.aid == clickedRow.aid)[0].user}
                                unbannedAdmin={clickedRow.removedBy && data.admins.filter(admin => admin.aid == clickedRow.removedBy)[0].user || ''}
                                aliases={data.aliases.filter(alias => alias.bid == clickedRow.bid).filter((alias, index, self) => index === self.findIndex((a) => a.name === alias.name)).map(alias => alias.name)}
                                avatar={data.avatars.filter(avatar => avatar.user == clickedRow.authid)[0].avatar}
                            />
                            ) || (
                                <BanDetailsSkeleton />
                            )
                        }
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}
