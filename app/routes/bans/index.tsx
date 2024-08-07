import { useLoaderData, defer, Await, type MetaFunction, Link } from "@remix-run/react";
import { Suspense, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { themeSessionResolver } from "~/sessions.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import { ThemeProvider } from "remix-themes";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "~/db/sourcebans/schema";
// import { ClientOnly } from "remix-utils/client-only";
// import { ProgressiveClientOnly } from "~/components/ProgressiveClientOnly";


export const meta: MetaFunction = () => {
    return [
        { title: "TriumphTF2 - Bans" },
        { name: "description", content: "TriumphTF2 Bans Page" },
    ];
};

const steamidConvert64 = (steamid: string) => {
    const baseline = BigInt("76561197960265728");
    const splitID = steamid.split(":");
    const product = BigInt(splitID[2]) * BigInt(2);
    const sum = product + baseline;
    return (sum + BigInt(splitID[1])).toString();
}
const steamidConvert32 = (steamid: string) => {
    const z = (BigInt(steamid) - BigInt("76561197960265728")) / BigInt(2);
    const y = BigInt(steamid) % BigInt(2);
    return `STEAM_0:${y.toString()}:${z.toString()}`;
}
export async function loader({ request }: LoaderFunctionArgs) {

    const { getTheme } = await themeSessionResolver(request)
    const connection = await mysql.createConnection({
        host: process.env.SOURCEBANS_DB_HOST,
        user: process.env.SOURCEBANS_DB_USER,
        password: process.env.SOURCEBANS_DB_PASSWORD,
        database: process.env.SOURCEBANS_DB_NAME,
        port: parseInt(process.env.SOURCEBANS_DB_PORT??"3306"),
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
    const users = [] as {user:string, avatar:string}[];
    const sids = [] as string[];
    for (const ban of bans) {
        if (ban.authid && users.filter(user => user.user == ban.authid).length == 0) {
            users.push({user: ban.authid, avatar: ''});
            sids.push(steamidConvert64(ban.authid));
        }
    }
    while (sids.length > 0) {
        // fetch 100 users at a time
        const lsids = sids.filter((sid, index) => index < 50);
        let reqstring = ''
        lsids.forEach((v,i) => {
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
            // console.log(`1 - sid ${sid}`);
            const user = users.findIndex((user) => user.user == sid);
            // console.log(`2 - user ${user}`);
            // console.log(`3 - player ${users[user]}`)
            if (user !== -1) {
                // console.log(`4 - avatar ${player.avatarfull}`)
                users[user].avatar = player.avatarfull; // FOR SOME GOD DAMN REASON THIS IS VALID
                // console.log(users[user]); // HERE... BUT WHEN I LATER PRINT IT...
            }
        }

    }
    // console.log(users); // HERE... IT DOESNT FUCKING SHOW UP
    connection.destroy();
    return defer({
        theme: getTheme(),
        bans: bans,
        admins: admins,
        aliases: aliases,
        avatars: users,
    });
}

export interface BanProps {
    bid: number;
    ip: string | null;
    authid: string;
    name: string;
    created: number; // as a unix timestamp
    ends: number; // as a unix timestamp
    length: number; // in seconds, 0 is permanent
    reason: string;
    aid: number; // admin id
    adminIp: string; // 0.0.0.0 if it was a console ban
    sid: number; // server id
    country: string | null; // country code
    removedBy: number | "NULL" | null; // null if not removed
    removeType: string  | null; // null if not removed
    removedOn: number | "NULL" | null; // null if not removed
    type: number; // 1 is an IP ban, 0 is a steamid ban. Most will be 0.
    ureason: string | null; // null if not removed
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
    const lengthToHumanReadable = (length: number) => {
        if (length === 0) {
            return "Permanent";
        }
        // We want to round it to a whole number of the most significant unit, eg: 2 weeks, 1 month, 1 year, etc...
        const units = [
            { name: "year", seconds: 31536000 },
            { name: "month", seconds: 2592000 },
            { name: "week", seconds: 604800 },
            { name: "day", seconds: 86400 },
            { name: "hour", seconds: 3600 },
            { name: "minute", seconds: 60 },
        ];
        for (const unit of units) {
            if (length >= unit.seconds) {
                const value = Math.floor(length / unit.seconds);
                return `${value} ${unit.name}${value > 1 ? 's' : ''}`;
            }
        }
    }

    return (
        <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
        <div>
            <div className="container mx-auto py-4">
                <h1 className="text-4xl font-bold text-primary dark:text-secondary py-4"><Link to="https://bans.triumphtf2.com/">Click here to go to the classic Bans page</Link></h1>
                <div className='flex gap-8'>
                    <div className="flex-1">
                        <Table>
                            <TableHeader className="bg-primary text-white font-bold">
                                <TableRow className="hover:bg-primary">
                                    <TableHead className="text-primary-foreground font-bold uppercase">Date/Time</TableHead>
                                    <TableHead className="text-primary-foreground font-bold uppercase">Player</TableHead>
                                    <TableHead className="text-primary-foreground font-bold uppercase">Length</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <Suspense>
                                <Await resolve={data.bans as BanProps[]}>
                                {data.bans.length > 0 && data.bans.map((ban, index) => (
                                    <TableRow key={ban.bid} onClick={handleRowClick(ban)} className={`cursor-pointer ${clickedRow && ban == clickedRow ? 'bg-yellow-200 hover:bg-yellow-100' : index % 2 === 0 ? 'bg-muted hover:bg-primary-foreground' : 'bg-background hover:bg-primary-foreground'} `}>
                                        <TableCell className="text-primary">
                                            <Suspense fallback="Loading...">
                                                {timestampToDateTime(ban.created)}
                                            </Suspense>
                                        </TableCell>
                                        <TableCell className="text-primary">{ban.name}</TableCell>
                                        <TableCell className={`${
                                            ban.removeType === null && ban.length > 0 ? 'text-yellow-500' :
                                                ban.removeType === null && ban.length === 0 ? 'text-red-500' :
                                                    ban.removeType === 'E' || ban.removeType === 'U' ? 'text-green-500' :
                                                        'text-blue-500'
                                        } font-bold`}>{lengthToHumanReadable(
                                            ban.length === 0 ? 0 : ban.ends - ban.created
                                        )} {ban.ends < (Date.now() / 1000) && ban.ends != ban.created && "(Expired)" || ban.removeType === 'E' && "(Expired)" || ban.removeType === 'U' && "(Unbnaned)" || ""}</TableCell>
                                    </TableRow>
                                ))}
                                </Await>
                                </Suspense>
                            </TableBody>
                        </Table>
                    </div>
                    {clickedRow && (
                        <div className="w-[300px] bg-muted rounded-lg p-4 sticky top-14 h-min">
                            <div className="ban-card-grid items-center gap-2 mb-4">
                                <Avatar className="inline-block w-18 h-18 col-span-1 row-span-1">
                                    <AvatarImage src={data.avatars.filter(a => a.user == clickedRow.authid)[0].avatar ?? 'https://via.placeholder.com/200'} alt='Player Avatar'/>
                                    <AvatarFallback className="bg-muted-foreground">{clickedRow.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="inline-block col-start-2 row-start-1">
                                    <div className="text-primary font-bold text-lg inline-block text-ellipsis text-nowrap w-full"><Link to={`https://steamcommunity.com/profiles/${steamidConvert64(clickedRow.authid)}`} target="_blank" rel="noreferrer" className="inline-block overflow-hidden text-ellipsis text-nowrap w-[100%]">{clickedRow.name}</Link></div>
                                    <div className="text-xs text-muted-foreground">{clickedRow.authid}</div>
                                </div>
                                <div className="inline-block w-[80%] col-start-1 col-end-3 row-start-2 row-end-2 px-4">
                                    <ul className="list-disc">
                                        <li className="text-xs text-muted-foreground">Banned by {data.admins.filter(admin => admin.aid == clickedRow.aid)[0].user}</li>
                                        {clickedRow.removedBy && (<li className="text-xs text-muted-foreground">Unbanned by {data.admins.filter(admin => admin.aid == clickedRow.removedBy)[0].user}</li>)}
                                    </ul>
                                </div>
                            </div>
                            <Separator className="my-4"/>
                            <div className="space-y-2">
                                <div>
                                    <div className="text-secondary-foreground text-sm font-medium">Ban Length:</div>
                                    <div className="text-primary">{lengthToHumanReadable(clickedRow.length === 0 ? 0 : clickedRow.ends - clickedRow.created)}</div>
                                </div>
                                <div>
                                    <div className="text-secondary-foreground text-sm font-medium">Ban Status:</div>
                                    <div className="text-primary">{
                                        clickedRow.removeType === 'E' ? 'Expired' :
                                        clickedRow.removeType === 'U' ? 'Unbanned' :
                                        clickedRow.length === 0 ? 'Active' :
                                        (Date.now() / 1000) > clickedRow.ends ? 'Expired' :
                                        `Active - Expires in ~${lengthToHumanReadable(clickedRow.ends - (Date.now() / 1000))}`}</div>
                                </div>
                                <div>
                                    <div className="text-secondary-foreground text-sm font-medium">Banned For:</div>
                                    <div className="text-primary text-xs">{clickedRow.reason}</div>
                                </div>
                                {clickedRow.ureason && (
                                <div>
                                    <div className="text-secondary-foreground text-sm font-medium">Unban Reason:</div>
                                    <div className="text-primary text-xs">{clickedRow.ureason}</div>
                                </div>
                                )}
                                {data.aliases.filter(alias => alias.bid == clickedRow.bid).length > 0 && (
                                <div>
                                    <div className="text-secondary-foreground text-sm font-medium">Aliases:</div>
                                    <div className="text-secondary flex flex-wrap gap-2">
                                        {data.aliases.filter(alias => alias.bid == clickedRow.bid).filter((alias, index, self) => index === self.findIndex((a) => a.name === alias.name)).map((alias,index) => (
                                            <Badge key={index} variant='outline'>{alias.name}</Badge>
                                        ))}
                                        {/* <Badge variant='outline'>Alias1</Badge>
                                        <Badge variant='outline'>Alias2</Badge> */}
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    ) || (
                        <div className="w-[300px] bg-muted rounded-lg p-4 sticky top-14 h-min">
                        <div className="flex items-center gap-2 mb-4">
                            <Avatar>
                                {/* <AvatarImage src='https://via.placeholder.com/200' alt='Player Avatar'/>
                                <AvatarFallback>...</AvatarFallback> */}
                            </Avatar>
                            <div>
                                <div className="text-primary font-bold text-lg">

                                        Select a Ban

                                </div>
                                <div className="text-xs text-muted-foreground">
                                    to view more details
                                </div>
                            </div>
                        </div>

                    </div>
                    )}
                </div>
            </div>
        </div>
        </ThemeProvider>
    );
}
