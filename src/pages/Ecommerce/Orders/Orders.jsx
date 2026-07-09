import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ChevronDown, Eye, MoreHorizontal } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import useFetch from "@/hooks/Api/useFetch";
import { useEffect } from "react";
import { useOrderStore } from "@/store/OrderStore";
import { DeleteSafeCheck } from "@/components/alert/alert";

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
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => <Link
      to={`/order/${row.getValue("id")}`}
      className="capitalize text-gray-600 hover:underline"
    >
      {row.getValue("id")}
    </Link>
  },
  {
    accessorKey: "customer_name",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original;
      < div className="capitalize text-gray-600" >
        {customer ? `${customer.fname}` : "N/A"
        }
      </div >
    }
  },
  {
    accessorKey: "email",
    header: "email",
    cell: ({ row }) => <div className="capitalize text-gray-600">{row.getValue("email")}</div>
  },
  {
    accessorKey: "created_at",
    header: "Due Date",
    cell: ({ row }) =>
      <div className="capitalize text-gray-600">{new Date(row.getValue("created_at")).toDateString()}</div>

  },
  {
    accessorKey: "total_amount",
    header: () => <div className="text-right">Total Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_amount"));
      const formatted = new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS"
      }).format(amount);
      return <div className="text-right font-medium text-gray-600">{formatted}</div>;
    }
  },
  {
    accessorKey: "status",
    header: "status",
    cell: ({ row }) => <div className="capitalize text-gray-600">
      {row.getValue("status") == "paid" ? <Badge color={"success"} children={"Completed"} /> : <Badge color="error" children={"Pending"} />}
    </div>
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;
      return <DropdownMenu>
            <div className="flex items-center space-x-2">
            <DeleteSafeCheck url = {`/api/orders/${row.getValue("id")}`} />
            <Link to={`/order/${row.getValue("id")}`} className="block w-full text-left">
              <Eye size={20} className="text-gray-500"  />
            </Link>
          </div>
        {/* <DropdownMenuTrigger asChild>
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
              to={`/order/${row.getValue("id")}`}
              className="capitalize text-gray-600 hover:underline"
            >
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-red-100 bg-red-50 text-red-600">
            <form onSubmit={(e) => { handleDelete(e, row.getValue("id")) }}>
              <button>
                Delete
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent> */}
      </DropdownMenu>;
    }
  }
];
function Orders() {

  //fetch orders from the api and store them in the zustand store
  const { data, isLoading, error } = useFetch("/api/orders");
  useEffect(() => {
    useOrderStore.getState().setOrders(data?.orders);
  }, [data?.orders])
  
  //grab the orders from the zustand store
  const orders = useOrderStore((state) => state.orders);

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState(
    []
  );
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data: orders  || [],
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
      <h1 className=" text-xl">Orders</h1>
      <p
        className="text-gray-400
         mb-4 text-sm"
      >
        List of your most recent Orders{" "}
      </p>
      <hr />
      <div className="flex items-center py-4">
        <Input
          placeholder="Search product..."
          value={table.getColumn("customer_name")?.getFilterValue() ?? ""}
          onChange={(event) => table.getColumn("customer_name")?.setFilterValue(event.target.value)}
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
        <Link
          className="bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 ml-4 px-4 py-2 rounded-lg"
          to="/orders/add_orders"
        >
          Add Order
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
                colSpan={columns?.length}
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
          {table.getFilteredSelectedRowModel().rows?.length} of{" "}
          {table.getFilteredRowModel().rows?.length} row(s) selected.
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
  Orders as default
};
