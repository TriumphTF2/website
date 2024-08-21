import { ColumnDef } from "@tanstack/react-table"

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
}

export const StatsColumns: ColumnDef<Stats>[] = [
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
    }
]
