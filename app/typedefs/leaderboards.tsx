import { ColumnDef } from "@tanstack/react-table"
import { Button } from "~/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { steamidConvert64 } from "~/utils"

export type Duel = {
    id: number
    winner: string // STEAMID
    loser: string // STEAMID
    winnerscore: number
    loserscore: number
    winlimit: number
    gametime: number // Unix timestamp
    mapname: string // eg mge_triumph_beta4
    arenaname: string
}

export type Stats = {
    id: number
    rating: number
    steamid: string // STEAMID
    name: string
    wins: number
    losses: number
    lastplayed: number // Unix timestamp
    hitblip: number // usually 1 but including all the same
    rank: number
    count: number
}

export const StatsColumns: ColumnDef<Stats>[] = [
    {
        accessorKey: "rank",
        header: "Rank",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "steamid",
        header: "SteamID",
    },
    {
        accessorKey: "rating",
        header: "Rating",
    },
    {
        accessorKey: "wins",
        header: "Wins",
    },
    {
        accessorKey: "losses",
        header: "Losses",
    },
    {
        accessorKey: "lastplayed",
        header: "Last Played",
        cell: ({ row }) => {
            const date = row.original.lastplayed
            const now = Date.now() / 1000
            let n = now - date
            if (now - date < (60 * 60)) {
                n = Math.floor(n / 60)
                return `${n} minute${n > 1 ? 's' : ''} ago`
            } else if (now - date < (60 * 60 * 24)) {
                n = Math.floor(n / (60 * 60))
                return `${n} hour${n > 1 ? 's' : ''} ago`
            } else if (now - date < (60 * 60 * 24 * 7)) {
                n = Math.floor(n / (60 * 60 * 24))
                return `${n} day${n > 1 ? 's' : ''} ago`
            } else if (now - date < (60 * 60 * 24 * 30)) {
                n = Math.floor(n / (60 * 60 * 24 * 7))
                return `${n} week${n > 1 ? 's' : ''} ago`
            } else if (now - date < (60 * 60 * 24 * 365)) {
                n = Math.floor(n / (60 * 60 * 24 * 30))
                return `${n} month${n > 1 ? 's' : ''} ago`
            }
            n = Math.floor(n / (60 * 60 * 24 * 365))
            return `${n} year${n > 1 ? 's' : ''} ago`
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const ranking = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(ranking.steamid)}
                        >
                            Copy SteamID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                // convert steamid to profile id
                                const steamid = steamidConvert64(ranking.steamid)
                                window.open(`https://steamcommunity.com/profiles/${steamid}`)
                            } }
                        >View Steam Profile</DropdownMenuItem>
                        {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

