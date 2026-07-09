import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import Badge from "@/components/ui/badge/Badge";
const data = [
  {
    warehouse_id: 1,
    warehouse_name: "Central Distribution Hub",
    location: "Accra, Ghana",
    warehouse_manager: "Kwame Mensah",
    phone_number: "+233 24 123 4567",
    id: 1,
    name: "MacBook Pro 13\u201D",
    quantity: "2",
    category: "Laptop",
    price: 2399,
    status: "sent",
    image: "/images/product/product-01.jpg"
  }
];
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
    header: "Product Name",
    cell: ({ row }) => {
      const { id, name } = row.original;
      return <>
          <div className="capitalize text-gray-600 hover:underline">{name}</div>
        </>;
    }
  },
  {
    accessorKey: "image",
    header: "Product Image",
    cell: ({ row }) => <img className="w-20" src={row.getValue("image")} alt="product_img" />
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <div className="capitalize text-gray-600">{row.getValue("quantity")}</div>
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <div className="capitalize text-gray-600">{row.getValue("category")}</div>
  },
  {
    accessorKey: "status",
    header: "status",
    cell: ({ row }) => <div className="capitalize text-gray-600">
        {row.getValue("status") == "stock" ? <Badge color={"success"} children={"In Stock"} /> : <Badge color="error" children={"Out of Stock"} />}
      </div>
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS"
      }).format(amount);
      return <div className="text-right font-medium text-gray-600">{formatted}</div>;
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <>
          <Button variant={"outline"} disabled children={"Pending"} />
          <form className="flex items-center gap-4" action="">
            <Button
        className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300"
        children={"Approve"}
      />
            <Button variant={"outline"} children={"Reject"} />
          </form>
        </>;
    }
  }
];
function Warehouse() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState(
    []
  );
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data,
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
        <div className="flex items-center py-4">
          <Input
    placeholder="Search product..."
    value={table.getColumn("warehouse_name")?.getFilterValue() ?? ""}
    onChange={(event) => table.getColumn("warehouse_name")?.setFilterValue(event.target.value)}
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
          <Button variant={"outline"} children={"Export"} />
        </div>

        <Tabs defaultValue="received" className="">
          <TabsList>
            <TabsTrigger value="received">Incoming</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing Requests</TabsTrigger>
          </TabsList>
          <TabsContent value="received">
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
          </TabsContent>
          <TabsContent value="outgoing">
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
          </TabsContent>
        </Tabs>
      </div>
    </>;
}
export {
  columns,
  Warehouse as default
};
