import React from 'react';
import { Link } from '@remix-run/react';
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { lengthToHumanReadable, steamidConvert64, banStatusToString, banLengthParse } from "~/utils";

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
    removeType: string | null; // null if not removed
    removedOn: number | "NULL" | null; // null if not removed
    type: number; // 1 is an IP ban, 0 is a steamid ban. Most will be 0.
    ureason: string | null; // null if not removed
}

export interface BanDetailsCardProps {
    ban: BanProps;
    admin: string;
    unbannedAdmin?: string;
    avatar?: string;
    aliases?: string[];
}


export const BanDetailsCard: React.FC<BanDetailsCardProps> = (props) => {
    // Implement your component logic here
    return (
        <div className="w-[300px] bg-muted rounded-lg p-4 sticky top-14 h-min hidden md:block">
            <div className="ban-card-grid items-center gap-2 mb-4 w-full">
                <Avatar className="block w-12 h-12 col-span-1 row-span-1">
                    <AvatarImage src={props.avatar} alt='Player Avatar' />
                    <AvatarFallback className="bg-muted-foreground">{props.ban.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="block col-start-2 row-start-1">
                    <Link aria-label={props.ban.name} className="text-primary font-bold text-lg block text-nowrap overflow-hidden w-[210px]" to={`https://steamcommunity.com/profiles/${steamidConvert64(props.ban.authid)}`} target="_blank" rel="noreferrer"><span className={props.ban.name.length > 24 ? 'marquee' : ''}>{props.ban.name}</span></Link>
                    <div className="text-xs text-muted-foreground">{props.ban.authid}</div>
                </div>
                <div className="block w-[80%] col-start-1 col-end-3 row-start-2 row-end-2 px-4">
                    <ul className="list-disc">
                        <li className="text-xs text-muted-foreground">Banned by {props.admin}</li>
                        {props.ban.removedBy != 0 && props.unbannedAdmin != "" && (<li className="text-xs text-muted-foreground">Unbanned by {props.unbannedAdmin}</li>)}
                    </ul>
                </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
                <div>
                    <div className="text-secondary-foreground text-sm font-medium">Reason:</div>
                    <div className="text-primary text-xs">{props.ban.reason}</div>
                </div>
                <div>
                    <div className="text-secondary-foreground text-sm font-medium">Ban Length:</div>
                    <div className="text-primary text-xs">{banStatusToString(banLengthParse(props.ban))}</div>
                </div>
                <div>
                    <div className="text-secondary-foreground text-sm font-medium">Ban Status:</div>
                    <div className="text-primary text-xs">{ banLengthParse(props.ban).isBanExpired ? 'Expired' : banLengthParse(props.ban).isBanUnbanned ? 'Unbanned' : banLengthParse(props.ban).isBanActive && banLengthParse(props.ban).isBanPermanent ? 'Active' : banLengthParse(props.ban).isBanActive ? `Active - Expires in ~${lengthToHumanReadable(props.ban.ends - (Date.now() / 1000)) }`: 'Unknown'}</div>
                </div>
                {props.ban.ureason && (<Separator className="my-4" />)}
                {props.ban.ureason && (
                    <div>
                        <div className="text-secondary-foreground text-sm font-medium">Unban Reason:</div>
                        <div className="text-primary text-xs">{props.ban.ureason}</div>
                    </div>
                )}
                {props.ban.removedOn && (
                    <div>
                        <div className="text-secondary-foreground text-sm font-medium">Unban Date:</div>
                        <div className="text-primary text-xs">{typeof(props.ban.removedOn) == 'number' ? new Date(props.ban.removedOn * 1000).toLocaleString() : 'Unknown'}</div>
                    </div>
                )}

                {props.aliases && props.aliases.length > 0 && (<Separator className="my-4" />)}
                {props.aliases && props.aliases.length > 0 && (
                    <div>
                        <div className="text-secondary-foreground text-sm font-medium">Aliases:</div>
                        <div className="text-secondary flex flex-wrap gap-2">
                            {props.aliases.map((alias, index) => (
                                <Badge key={index} variant='outline'>{alias}</Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const BanDetailsSkeleton: React.FC = () => {
    return (
        <div className="w-[300px] bg-muted rounded-lg p-4 sticky top-14 h-min hidden md:block">
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
    )
};
