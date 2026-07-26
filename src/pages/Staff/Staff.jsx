import * as React from "react";
import { useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { ChevronDown, Eye, MoreHorizontal, Plus } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import useFetch from "../../hooks/Api/useFetch";
import { DeleteSafeCheck } from "@/components/alert/alert";
import { useWarehouseStore } from "@/store/WarehouseStore";
import { useAuth } from "@/hooks/useAuth";
import { connectRealtimeStore, disconnectRealtimeStore } from "@/lib/echoEvent";
import { useStaffStore } from "@/store/StaffStore";

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
    accessorKey: "fname",
    header: "Firstname",
    cell: ({ row }) => {
      const { id, fname } = row.original;
      return <Link
        to={`/warehouses/${id}`}
        className="capitalize text-gray-600 hover:underline"
      >
        {fname}
      </Link>;
    }
  },
  {
    accessorKey: "lname",
    header: "Lastname",
    cell: ({ row }) => <div className="capitalize text-gray-600">{row.getValue("lname")}</div>
  },
  {
    accessorKey: "email",
    header: "email",
    cell: ({ row }) => <div className="capitalize text-gray-600">{row.getValue("email")}</div>
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className="capitalize text-gray-600">
      {row.getValue("role")}
    </div>
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { id } = row.original;
      return <DropdownMenu>
        <div className="flex items-center space-x-2">
          <DeleteSafeCheck url = {`api/staff/${id}`}/>
          {/* <Link to={`/warehouses/${id}`} className="block w-full text-left">
            <Eye size={20} className="text-gray-500"  />
          </Link> */}
        </div>
      </DropdownMenu>;
    }
  }
];

function Staff() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState(
    []
  );
  const { data: staffData, error, isPending } = useFetch("api/users");
  const setStaff = useStaffStore((state) => state.setStaff);

  //set staff after the data is retrieved from the api
  useEffect(() => {
    if (!staffData?.users) return;

    setStaff(staffData.users);
    const channelName = "private-users";
    connectRealtimeStore(
      () => useStaffStore.getState().Staff,
      setStaff,
      { channelName, modelType: "users" }
    );

    return () => disconnectRealtimeStore(channelName);
  }, [staffData?.users, setStaff]);

  const staff = useStaffStore((state) => state.Staff)

  //grap auth user data
  const {auth} = useAuth();


  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data: staff ?? [],
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
      <h1 className=" text-xl">Warehouse Staff</h1>
      <p
        className="text-gray-400
         mb-4 text-sm"
      >
        List of Staff{" "}
      </p>
      <hr />
      <div className="flex items-center py-4">
        <Input
          placeholder="Search product..."
          value={table.getColumn("fname")?.getFilterValue() ?? ""}
          onChange={(event) => table.getColumn("fname")?.setFilterValue(event.target.value)}
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
          className="flex items-center bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 ml-4 px-4 py-2 rounded-lg"
          to="/register"
        >
            <Plus size={20} />
            New
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
  Staff as default
};
