import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import useFetch from "../../hooks/Api/useFetch";

const columns = [
  {
    id: "select",
    header: ({ table }) => <Checkbox
      checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected() && "indeterminate"}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />,
    cell: ({ row }) => <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "name",
    header: "Warehouse",
    cell: ({ row }) => {
      const { id, name } = row.original;
      return <Link
        to={`/warehouses/${id}`}
        className="capitalize text-gray-600 hover:underline"
      >
        {name}
      </Link>;
    }
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <div className="capitalize text-gray-600">{row.getValue("location")}</div>
  },
  {
    accessorKey: "warehouse_staff",
    header: "Manager",
    cell: ({ row }) => {
      const staff = row.original.warehouse_staff;

      return (
        <div className="capitalize text-gray-600">
          {staff ? `${staff.fname} ${staff.lname}` : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
    cell: ({ row }) => <div className="capitalize text-gray-600">
      {row.getValue("phone_number")}
    </div>
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { id } = row.original;
      return <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white" align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:bg-gray-100">
            <Link
              to={`/warehouses/${id}`}
              className="capitalize text-gray-600 hover:underline"
            >
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-red-100 bg-red-50 text-red-600">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>;
    }
  }
];

function Warehouses() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState(
    []
  );
  const { data, error, isPending } = useFetch("api/warehouses");
  console.log("Fetched data:", data);
  console.log("Fetch error:", error);

  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data: data?.warehouses ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });
  return <>
    <div className="w-full bg-white p-4 rounded-2xl border border-gray-200">
      <h1 className=" text-xl">Warehouses</h1>
      <p
        className="text-gray-400
         mb-4 text-sm"
      >
        List of your Other Warehouses{" "}
      </p>
      <hr />
      <div className="flex items-center py-4">
        <Input
          placeholder="Search product..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white" align="end">
            {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => {
              return <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>;
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Link
          className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 ml-4 px-4 py-2 rounded-lg"
          to="/add_product"
        >
          Add Warehouse
        </Link>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>;
              })}
            </TableRow>)}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? table.getRowModel().rows.map((row) => <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => <TableCell key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </TableCell>)}
            </TableRow>) : <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  </>;
}
export {
  columns,
  Warehouses as default
};
