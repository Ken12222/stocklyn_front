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

export function DeleteSafeCheck({ url }) {

    const { mutate:deleteProduct, data:deleteData, error:deleteError, isLoading, isError, isSuccess } = useDelete(url)

  async function handleDelete(e){
    e.preventDefault()
    deleteProduct()
  }

  if(isSuccess){
    toast.success(deleteData?.message, {
      position: "top-center"
    })
  }

  if(isError){
    toast.error(deleteData?.message, {position:"top-center"})
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
            <AlertDialogAction>
              Continue
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  
}
