import { useProductStore } from "@/store/ProdcutStore";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow
} from "../../../components/ui/table";
import Button from "@/components/ui/button/Button";
import { Link, useParams } from "react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import usePut from "@/hooks/Api/usePut";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from "react";
import { CloseIcon } from "@/icons";

export default function SingleProduct() {
    const productID = useParams();
    // Fetch the product from the store using the ID from the URL
    const product = useProductStore.getState().products.find(product=>product.id === parseInt(productID?.id));

    //validate form details here.
    const schema = yup.object({
        name:yup.string().required(),
        price:yup.number().positive().min(1, "Price must cannot be empty"),
        quantity:yup.number().positive().integer().required(),
        category:yup.string().required(),
    }).required()

    // Initialize the form with default values from the product
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver:yupResolver(schema),
        defaultValues:{
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            category: product.category
        }
    });

    const [closeSuccess, setCloseSuccess] = useState(false);
    // Use the usePut hook to handle adding the product
    const {mutate: addProduct, data, error, isLoading, isError, isSuccess} = usePut(`/api/products/${productID?.id}`);
    // Handle the form submission to add the product
    async function handleAddProduct(data) {
        addProduct(data);
        isSuccess ? setCloseSuccess(true) : ""
        console.log(closeSuccess)
        
    }
    //add a close button for users to close the success or error state after an update

    return <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h1 className="m-4">Product</h1>
        <hr className="my-4" />
        <div className=" p-4 md:flex gap-4">
            <div>
                <img src={product?.image} alt={product?.name} className="w-48 h-full object-cover rounded-lg" />
            </div>
            <div>
                <p className="border rounded-full  px-4 py-1 my-2 w-fit text-gray-400 text-sm">{product?.category}</p>
                <h2 className="text-2xl font-semibold mb-2">{product?.name}</h2>
                <p className="text-3xl mb-2 font-bold">GH¢{parseFloat(product?.price).toFixed(2)}</p>

                {product?.quantity && product?.quantity !== undefined ? (
                    <p className="text-gray-400 text-sm mb-2">In Stock: {product?.quantity}</p>
                ) : <p className="text-red-400 text-sm">Out of Stock</p>}

                <div className="flex gap-2 items-center">
                    <Link to={`/orders/add_orders`} className=" text-white text-sm  hover:bg-blue-600 py-3 px-4 rounded-lg my-2 bg-primary">Place Order</Link>
                    <Dialog>
                        <DialogTrigger asChild>
                        <Button variant="outline">Add Product</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                        <DialogHeader>
                            <DialogTitle>Add Products</DialogTitle>
                            <DialogDescription>
                            Enter Product Quantity
                            </DialogDescription>
                            {isSuccess && closeSuccess && <div className="bg-green-200 border-1 border-green-400 text-green-900 rounded-md p-4 flex justify-between">
                                <p className="">{data.message}</p>
                                <CloseIcon size={4} onClick={()=>setCloseSuccess(!closeSuccess)}/>
                            </div>
                            }
                        </DialogHeader>
                    <form onSubmit={handleSubmit(handleAddProduct)} >
                        <div className="mb-4">
                            <Label htmlFor="name" className="my-2">Name</Label>
                            <Input id="name" {...register("name")} />
                            {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>}
                            {error?.name && <p className="text-red-500 text-sm mt-2">{error.name.message}</p>}
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="price" className="my-2">Price</Label>
                            <Input id="price" {...register("price")} />
                            {errors.price && <p className="text-red-500 text-sm mt-2">{errors.price.message}</p>}
                            {error?.price && <p className="text-red-500 text-sm mt-2">{error.price.message}</p>}
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="category" className="my-2">Category</Label>
                            <Input id="category" {...register("category")} />
                            {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category.message}</p>}
                            {error?.category && <p className="text-red-500 text-sm mt-2">{error.category.message}</p>}
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="quantity" className="my-2">Quantity</Label>
                            <Input id="quantity" {...register("quantity")} />
                            {errors.quantity && <p className="text-red-500 text-sm mt-2">{errors.quantity.message}</p>}
                            {error?.quantity && <p className="text-red-500 text-sm mt-2">{error.quantity.message}</p>}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                        </DialogContent>
                    </Dialog>
                </div>

            </div>
        </div>
    </div>
}

