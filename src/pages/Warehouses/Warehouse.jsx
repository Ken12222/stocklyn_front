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
import { Link, useParams } from "react-router";
import { AiOutlineDelete } from "react-icons/ai";
import useFetch from "@/hooks/Api/useFetch";
import { useWarehouseStore } from "@/store/WarehouseStore";
import { DeleteSafeCheck } from "@/components/alert/alert";
import usePost from "@/hooks/Api/usePost";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

function Warehouse() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState(
    []
  );

  const { data, mutate: createProduct, error:requestError, isLoading, isSuccess } = usePost("/api/request");

  const schema = yup.object({
    "name": yup.string().required(),
    "quantity": yup.number().positive().integer().required(),
    "date":yup.date().required()
  }).required()

  const {register, handleSubmit, formState:{errors}} = useForm({
    resolver: yupResolver(schema),
    defaultValues:{
      "date":"",
      "quantity":"",
      "name":""
    }
  })

  function RequestProduct(data){
    //e.preventDefault();
    createProduct( {
      onSuccess: () => {
        toast.success("Request has been added successfully", {
          position: "top-center"
        })
      },
      onError: (error) => {
        toast.error("Failed to add Request. Please try again later", {position:"top-center"})
      }
    })
  }
  
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
                {row.getValue("status") == "stock" ? <Button variant="outline">Request Item</Button> : <Button type="button" disabled variant="outline">
                    Request Item
                  </Button>}
              </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Make a transfer request</DialogTitle>
                    <DialogDescription className="text-sm">
                      Send a request to this warehouse to send you a specified
                      number of this item
                    </DialogDescription>
                  </DialogHeader>
              <form onSubmit={handleSubmit(RequestProduct)} >
                  <div className="grid gap-4 mt-4">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        defaultValue={row.getValue("name")}
                      />
                      {errors && <p className="text-red-500 text-sm">{errors && errors?.name?.message}</p> }
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        {...register("quantity")}
                        name="quantity"
                        placeholder="Enter product quantity"
                      />
                      {errors && <p className="text-red-500 text-sm">{errors && errors?.quantity?.message}</p> }
                    </div>
                    <div className="grid gap-3 mb-4">
                      <Label htmlFor="expected_date">Expected Date</Label>
                      <Input
                        id="date"
                        type="date"
                        {...register("date")}
                        defaultValue="enter date"
                      />
                      {errors && <p className="text-red-500 text-sm">{errors && errors?.date?.message}</p> }
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
              </form>
                </DialogContent>
            </Dialog>
            <DeleteSafeCheck url={`/api/warehouses/${1}`}/>
          </div>;
      }
    }
  ];
  const warehouseId = useParams()
  const {data:warehouse, error, isPending} = useFetch(`api/warehouses/${warehouseId?.id}`)
  
  useEffect(()=>{
    if(warehouse){
      useWarehouseStore.getState().setWarehouse(warehouse?.warehouse)
    }
  },[warehouse])
  
  const warehouseData = useWarehouseStore(state=>state.warehouse)

  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const table = useReactTable({
    data: warehouseData?.products ?? [],
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
          {warehouseData && 
          <div className="">
              <div className="flex items-center">
                <h1 className="font-semibold">{warehouseData.name}</h1>
                <LuDot className="text-gray-400" />
                <p>{warehouseData.warehouse_staff?.fname && warehouseData.warehouse_staff?.lname ? warehouseData.warehouse_staff.fname + ` ${warehouseData.warehouse_staff.lname}`: "N/A"}</p>
              </div>
              <div className="flex items-center">
                <p>{warehouseData?.location}</p>
                <LuDot className="text-gray-400" />
                <p>{warehouseData?.phone_number}</p>
              </div>
            </div>}
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
  // columns,
  Warehouse as default
};
