"use client"

import { ColumnDef } from "@tanstack/react-table"

export type BanRow = {
    id: string,
    status: string,

}

export const columns: ColumnDef<BanRow>[] = [
    {
        accessorKey: "avatar",
        header: "",
    },
    {
        accessorKey: "name",
        header: "Player",
    },
    {
        accessorKey: "authid",
        header: "",
    },
    {
        accessorKey: "status",
        header: "Length",
    },
    {
        accessorKey: "listed",
        header: "Listed",
    },
    {
        accessorKey: "expires",
        header: "Expires",
    },
]
