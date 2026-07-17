import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "../../components/ui/table";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { AiOutlineDelete } from "react-icons/ai";
import { useProductStore } from "@/store/ProdcutStore";
import useFetch from "@/hooks/Api/useFetch";
import { useEffect, useState } from "react";
import {useWishListStore} from "@/store/wishListStore";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Pen } from "lucide-react";
import { Spinner } from "../alert/spinner";

export function OrderTable(){

    //fetch products from api endpoint and store in zustand store
    const { data, error, isPending } = useFetch("api/products");
    const wishListIDs = useWishListStore(state=>state.wishList)
    const products = useProductStore((state) => state.products);
    const removeItem = useWishListStore((state) => state.removeItem);
    const [quantity, setQuantity] = useState(1)
    const [productID, setProductID] = useState(null)

    
    useEffect(() => {
        useProductStore.getState().setProducts(data?.products ?? []);
    },[data]);
    
    //save the products in the products store
    function handleWishList(e, productID){
        e.preventDefault();
        const id = Number(productID);

        if(wishListIDs === 0 || id === null || id === 0 || id === undefined){
            return toast.error("Please select a product to add to order list", {position: "top-center"})
        }
        wishListIDs.includes(id) ? toast.error("Product already added to order list", {position: "top-center"}) :
        useWishListStore.getState().setWishList(id);
    }
    const productsInWishList = products?.filter(product => wishListIDs.includes(product.id));

    error ? toast.error("Failed to load products, try again later", {position: "top-center"}):"";
    isPending ? <Spinner /> : ""
    
    return (
        <>
            <div className="overflow-hidden mt-4 rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <Table>
            <TableHeader>
                <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Cost</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Total</TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
            {productsInWishList && productsInWishList.map((item, index) => 
                <TableRow key={index} className="hover:bg-gray-100 dark:hover:bg-white/5">
                <TableCell className="py-4">{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>0%</TableCell>
                <TableCell>GH¢{item.price * quantity}</TableCell>
                <TableCell>
                    <Button type="button" variant={"ghost"} onClick={(e)=>removeItem(item.id)}>
                        <AiOutlineDelete
                        size={20}
                        className="hover:text-red-600 transition ease-in 1000ms"
                        />
                    </Button>
                </TableCell>
                <TableCell>
                    <Pen
                    size={20}
                    className="hover:text-red-600 transition ease-in 1000ms"
                    />
                </TableCell>
                </TableRow>)}
            </TableBody>
            </Table>
        </div>
        <div className="flex gap-4 items-center my-4 border border-gray-200 bg-gray-100 rounded-2xl px-4 pb-3 pt-2 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div>
            <Label children={"Product Name"} htmlFor="product_name" />
                <Combobox items={products} value={products?.name} onValueChange={(value) => {setProductID(value)}}>
                <ComboboxInput placeholder="Select a product" />
                <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                    {(item) => (
                    <ComboboxItem key={item.id} value={item.id.toString()}>
                        {item.name}
                    </ComboboxItem>
                    )}
                </ComboboxList>
                </ComboboxContent>
            </Combobox>
            {/* {errors.product_name && <p className="text-red-500 text-sm">{errors.product_name.message}</p> } */}
            </div>
            <div>
            <Label children={"Quantity"} htmlFor="quantity" />
            <div className="flex items-center px-4 rounded-lg border border-gray-200">
                <Input
                className="w-full border-0 "
                type="number"
                defaultValue={1}
                value={quantity}
                onChange={((e)=>setQuantity(e.target.value))}
                placeholder={"product quantity"}
                />
            </div>
            </div>
            <div>
            <Button type="button" onClick={(e)=>{handleWishList(e, productID)}} children={"Save Product"} />
            </div>
        </div>
        </>
    )
}