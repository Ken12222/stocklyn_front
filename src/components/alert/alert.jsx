import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button"
import { Trash } from "lucide-react"
import useDelete from "@/hooks/Api/useDelete"
import { toast } from "sonner"
import { useParams } from "react-router"
import { useEffect } from "react"
import { useWarehouseStore } from "@/store/WarehouseStore"
import { Spinner } from "./spinner"

export function DeleteSafeCheck({ url, id }) {
  const { mutate:deleteProduct, data:deleteData, error:deleteError, isPending, isError, isSuccess } = useDelete(url)
  const warehouses = useWarehouseStore(state=>state.warehouses)
  const removeWarehouse = useWarehouseStore(state=>state.removeWarehouse)
  
  async function handleDelete(e){
    e.preventDefault()
    deleteProduct()
  }

  if(isPending){

    // <Spinner />
  }

  if(isSuccess){
    toast.success(deleteData?.message, {
      position: "top-center"
    })
  }
  
  if(isError){
    deleteData && toast.error(deleteData?.message, {position:"top-center"})
    deleteError && toast.error(deleteError?.message, {position:"top-center"})
  }

  return <AlertDialog>
      <AlertDialogTrigger>
        <Trash size={20} className="text-gray-500" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure about this action?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form onSubmit={(e)=>handleDelete(e)}>
            <AlertDialogAction asChild>
              <Button type="submit">
                Continue
              </Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  
}
