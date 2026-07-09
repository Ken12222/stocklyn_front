import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import Badge from "@/components/ui/badge/Badge";
import { Link, useParams } from "react-router";
import useFetch from "../../../hooks/Api/useFetch";
import { useEffect, useState } from "react";
import { useProductStore } from "../../../store/ProdcutStore";
import { preventDefault } from "@fullcalendar/core/internal";
import useDelete from "@/hooks/Api/useDelete";
import { toast } from "sonner";
import { DeleteSafeCheck } from "@/components/alert/alert";


function Products() {

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
      accessorKey: "image",
      header: "",
      cell: ({ row }) => <img className="w-5 h-5" src={row.getValue("image")} alt="" />
    },
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => <div className="capitalize text-gray-600">{row.getValue("name")}</div>
    },
    {
      accessorKey: "category",
      header: "category",
      cell: ({ row }) => <div className="capitalize text-gray-600">{row.getValue("category")}</div>
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown />
        </Button>;
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("quantity")}</div>
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
        const product = row.original;
        return <DropdownMenu>
          <div className="flex items-center space-x-2">
            <DeleteSafeCheck url = {`/api/products/${product.id}`} />
            <Link to={`/products/${product.id}`} className="block w-full text-left">
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
              <Link to={`/products/${product.id}`} className="block w-full text-left">
                View Product
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem  className="hover:bg-red-100 bg-red-50 text-red-600">
              <form onSubmit={(e)=>handleDelete(e, product.id)}>
                <Button>
                Delete
                </Button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>;
      }
    }
  ];
  //delete product
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState(
    []
  );

  //fetch products from api endpoint and store in zustand store
  const { data, error, isPending } = useFetch("api/products");

  //save the products in the products store
  useEffect(() => {
    useProductStore.getState().setProducts(data?.products ?? []);
  },[data]);
  
  const tableData = useProductStore((state) => state.products);

  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});


  const table = useReactTable({
    data: tableData,
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


  return <div className="w-full bg-white p-4 rounded-2xl border border-gray-200">
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
        Add Product
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
  </div>;
}
// export {
//   columns,
//   Products as default
// };
export {
  Products as default
};
