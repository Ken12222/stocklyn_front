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
import { LuDot } from "react-icons/lu";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { AiOutlineDelete } from "react-icons/ai";
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
    status: "stock",
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
          <Link
        to={`/warehouses/${id}`}
        className="capitalize text-gray-600 hover:underline"
      >
            {name}
          </Link>
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
      return <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              {row.getValue("status") == "stock" ? <Button variant="outline">Request Item</Button> : <Button disabled variant="outline">
                  Request Item
                </Button>}
            </DialogTrigger>
            <form>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Make a transfer request</DialogTitle>
                  <DialogDescription>
                    Send a request to this warehouse to send you a specified
                    number of this item
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
        id="name"
        name="name"
        defaultValue={row.getValue("name")}
      />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
        id="quantity"
        name="quantity"
        placeholder="Enter product quantity"
      />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="expected_date">Expected Date</Label>
                    <Input
        id="date"
        type="date"
        name="date"
        defaultValue="enter date"
      />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
        className="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300"
        type="submit"
      >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
          <AiOutlineDelete size={"25"} className="hover:text-red-600" />
        </div>;
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
      <div className="w-full bg-white p-4 rounded-2xl border border-gray-200 my-2">
        <div className="flex justify-between items-center my-4">
          {data.map((w) => <div className="">
              <div className="flex items-center">
                <h1 className="font-semibold">{w.warehouse_name}</h1>
                <LuDot className="text-gray-400" />
                <p>{w.warehouse_manager}</p>
              </div>
              <p>{w.phone_number}</p>
            </div>)}
          <Link
    to="/add_invoice"
    className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 ml-4 px-4 py-2 rounded-lg"
  >
            New Warehouse
          </Link>
        </div>
      </div>
      <div className="w-full bg-white p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center py-4">
          <Input
    placeholder="Search product..."
    value={table.getColumn("customer")?.getFilterValue() ?? ""}
    onChange={(event) => table.getColumn("customer")?.setFilterValue(event.target.value)}
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
  Warehouse as default
};
