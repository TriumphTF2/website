import type { MetaFunction } from "@remix-run/react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";


export const meta: MetaFunction = () => {
    return [
        { title: "TriumphTF2 - Bans" },
        { name: "description", content: "TriumphTF2 Bans Page" },
    ];
};

export interface BanProps {
    bid: number;
    ip: string;
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
    RemovedBy: number | null; // null if not removed
    RemovedType: "E" | "U" | null; // null if not removed
    RemovedOn: number | null; // null if not removed
    type: 0 | 1; // 1 is an IP ban, 0 is a steamid ban. Most will be 0.
    ureason: string | null; // null if not removed
}

export default function Bans() {
    const [clickedRow, setClickedRow] = React.useState<BanProps | null>(null);
    const handleRowClick = (ban: BanProps) => {
        return () => {
            setClickedRow(ban);
        }
    }

    const bans = [] as BanProps[];
    const ban1 = {
        bid: 1,
        ip: '',
        authid: "STEAM_0:0:123456",
        name: "Player1",
        created: 1642484161,
        ends: 1645076161,
        length: 2592000,
        reason: "Cheating",
        aid: 1,
        RemovedType: 'E',
    } as BanProps;
    bans.push(ban1);
    bans.push(ban1);
    bans.push(ban1);

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
        <div>
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold">TriumphTF2 Bans</h1>
                <div className='flex gap-8'>
                    <div className="flex-1">
                        <Table>
                            <TableHeader className="bg-primary text-white font-bold">
                                <TableRow className="hover:bg-primary">
                                    <TableHead className="text-white font-bold uppercase">Date/Time</TableHead>
                                    <TableHead className="text-white font-bold uppercase">Player</TableHead>
                                    <TableHead className="text-white font-bold uppercase">Length</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bans.length > 0 && bans.map((ban, index) => (
                                    <TableRow key={ban.bid} onClick={handleRowClick(ban)} className={`cursor-pointer ${index % 2 === 0 ? 'bg-muted' : 'bg-background'} hover:bg-primary-foreground`}>
                                        <TableCell>{timestampToDateTime(ban.created)}</TableCell>
                                        <TableCell>{ban.name}</TableCell>
                                        <TableCell className={`${
                                            ban.RemovedType === null && ban.length > 0 ? 'text-yellow-500' :
                                                ban.RemovedType === null && ban.length === 0 ? 'text-red-500' :
                                                    ban.RemovedType === 'E' || ban.RemovedType === 'U' ? 'text-green-500' :
                                                        'text-blue-500'
                                        } font-bold`}>{lengthToHumanReadable(
                                            ban.length === 0 ? 0 : ban.ends - ban.created
                                        )} {ban.ends < (Date.now() / 1000) && "(Expired)" || ""}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {clickedRow && (
                        <div className="w-[300px] bg-muted rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Avatar>
                                    <AvatarImage src='https://via.placeholder.com/150' alt='Player Avatar' />
                                    <AvatarFallback>{clickedRow.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-bold text-lg">{clickedRow.name}</div>
                                    <div className="text-xs text-muted-foreground">Banned by {'Adminnamehere'}</div>
                                </div>
                            </div>
                            <Separator className="my-4"/>
                            <div className="space-y-2">
                                <div>
                                    <div className="text-sm font-medium">Ban Length:</div>
                                    <div>{lengthToHumanReadable(clickedRow.length === 0 ? 0 : clickedRow.ends - clickedRow.created)}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium">Ban Status:</div>
                                    <div>{
                                        clickedRow.RemovedType === 'E' ? 'Expired' :
                                        clickedRow.RemovedType === 'U' ? 'Unbanned' :
                                        clickedRow.length === 0 ? 'Permanent' :
                                        (Date.now() / 1000) > clickedRow.ends ? 'Expired' :
                                        'Active'}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium">Aliases:</div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant='outline'>Alias1</Badge>
                                        <Badge variant='outline'>Alias2</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
