import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"

import { Button } from "~/components/ui/button"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    className?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    className,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
    })
    return (
        <div>
            <div className="rounded-md border border-secondary-foreground dark:border-primary-foreground ">
                <Table className={className}>
                    <TableHeader className="dark:bg-secondary dark:hover:bg-secondary bg-primary hover:bg-primary dark:text-primary text-secondary ">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow className="dark:bg-secondary dark:hover:bg-secondary bg-primary hover:bg-primary dark:text-primary text-secondary" key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead scope="col" className="font-bold text-secondary dark:text-primary bg-primary dark:bg-secondary" key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    className="dark:bg-secondary dark:hover:bg-secondary bg-primary hover:bg-primary dark:text-primary text-secondary hover:text-blue-500"
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={false}
                >
                    Previous
                </Button>
                <Button
                    className="dark:bg-secondary dark:hover:bg-secondary bg-primary hover:bg-primary dark:text-primary text-secondary hover:text-blue-500"
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={false}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
