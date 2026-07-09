import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import { AiOutlineDelete } from "react-icons/ai";
import { IoAdd } from "react-icons/io5";
import { RiSubtractFill } from "react-icons/ri";
import Select from "../../../components/form/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "../../../components/ui/table";
import Button from "@/components/ui/button/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

function AddOrder() {
  const schema = yup.object({
    payment_method: yup.string().required(),
      status: yup.string().required(),
      shipping_address: yup.string().required(),
      product_id: yup.number().positive().integer().required(),
      unit_price: yup.number().positive().required(),
      total_price: yup.number().positive().required(),
      quantity: yup.number().positive().required(),
      user_id: yup.number().positive().integer().required(),
      total_amount: yup.number().positive().required()
  
  }).required()

  const {register, handleSubmit, formState:{errors}} = useForm({
    resolver: yupResolver(schema),
    defaultValues:{
      payment_method: "",
      status: "",
      shipping_address: "",
      // order_details: [
      //   {
      //     product_id: "",
      //     unit_price: "",
      //     total_price: "",
      //     quantity: "",
      //     user_id: "",
      //     total_amount: "",
      //   }
      // ]
    }
  })

  function handleQuantityChange(e, index) {
    const value = e.target.value;

    setOrderData(prev => {
      const updatedDetails = [...prev.order_details];

      updatedDetails[index] = {
        ...updatedDetails[index],
        quantity: value === "" ? "" : Number(value),
      };

      return {
        ...prev,
        order_details: updatedDetails,
      };
    });
  }

  function increaseCount() {
    setCount(count + 1);
  }
  function decreaseCount() {
    setCount(count - 1);
  }
  function handleAddOrder() {
    e.preventDefault();
    console.log("backend code running now");
  }

  function handleWishList(e, productID){
    e.preventDefault();
    console.log("wishlist running")
  }

  return <>
    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">
      Add Order
    </h3>
    <form onSubmit={handleSubmit(handleAddOrder)} className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h6 className="text-lg text-gray-800 dark:text-white/90">
            Create Order
          </h6>
        </div>
      </div>
      <hr className="my-4" />
      <div className="w-full md:grid grid-cols-2 gap-4">
        <div>
          <Label children={"Customer Name"} htmlFor="customer_name" />
          {
            // orderData.order_details.map((item, index) => (
              <Input
                className="w-full"
                name="customer_name"
                placeholder="John Doe"
                {...register("user_id")}
                // value={orderData.order_details[index].customer_name}
                // onChange={(e) => handleQuantityChange(e, index)}
              />
            // ))
          }
          {errors.user_id && <p className="text-red-500">{errors.user_id.message}</p>}
        </div>
        <div className="">
          <Label children={"Customer Address"} htmlFor="customer_address" />
          <Input
            className="w-full"
            name="customer_address"
            {...register("shipping_address")}
            placeholder="Tema, Community 25"
          />
          {errors.shipping_address && <p className="text-red-500">{errors.shipping_address.message}</p>}
        </div>
        <div>
          <Label children={"Payment Method"} htmlFor="payment_method" />
          <Input
            className="w-full"
            name="payment_method"
            placeholder="Cash"
            {...register("payment_method")}
            // value={orderData.payment_method}
            // onChange={(e) => setOrderData({ ...orderData, payment_method: e.target.value })}
          />
          {errors.payment_method && <p className="text-red-500">{errors.payment_method.message}</p>}
        </div>
        <div>
          <Label children={"Status"} htmlFor="status" />
          <Select
          {...register("status")}
            options={[
              { value: "pending", label: "Pending" },
              { value: "paid", label: "Paid" },
              { value: "unpaid", label: "Unpaid" }
            ]}
            // value={orderData.status}
            // onChange={(e) => setOrderData({ ...orderData, status: e.target.value })}
            className="w-full"
            name="status"
            placeholder="Pending"
          />
          {errors.status && <p className="text-red-500">{errors.status.message}</p>}
        </div>
      </div>
      <hr className="my-4" />
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
            <TableRow>
              <TableCell className="py-4">1</TableCell>
              <TableCell>Macbook pro 13”</TableCell>
              <TableCell>1</TableCell>
              <TableCell>GH¢13,000.00</TableCell>
              <TableCell>0%</TableCell>
              <TableCell>GH¢13,000.00</TableCell>
              <TableCell>
                <AiOutlineDelete
                  size={20}
                  className="hover:text-red-600 transition ease-in 1000ms"
                  />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {errors.product_id && <p className="text-red-500 border border-red-600 bg-red-100 w-fit p-2 rounded-lg">{errors.product_id.message}</p>}
      </div>
      <div className="flex gap-4 items-center my-4 border border-gray-200 bg-gray-100 rounded-2xl px-4 pb-3 pt-2 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div>
          <Label children={"Product Name"} htmlFor="product_name" />
          {
            // orderData.order_details.map((item, index) => (
              <Input
                className="w-full"
                name="product_name"
                placeholder="Eg: Samsung Tv set"
                // value={orderData.order_details[index].product_id}
                // onChange={(e) => handleQuantityChange(e, index)}
              />
              // ))
            }
        </div>
        <div>
          <Label children={"Price"} htmlFor="price" />
          {
            // orderData.order_details.map((item, index) => (
              <Input
                className="w-full"
                name="price"
                placeholder="Eg: GH¢100.00"
                // value={orderData.order_details[index].unit_price}
                // onChange={(e) => handleQuantityChange(e, index)}
              />
              // ))
              }
        </div>
        <div>
          <Label children={"Quantity"} htmlFor="quantity" />
          <div className="flex items-center px-4 rounded-lg border border-gray-200">
            {/* <IoAdd onClick={increaseCount} /> */}
            {
              // orderData.order_details.map((item, index) => (
                <Input
                  className="w-full border-0 "
                  type="number"
                  defaultValue={1}
                  placeholder={"product quantity"}
                  // value={orderData.order_details[index].quantity}
                  // onChange={(e) => handleQuantityChange(e, index)}
                />
              // ))
            }
            {/* <RiSubtractFill onClick={decreaseCount} /> */}
          </div>
        </div>
        <div>
          <Button type="button" onClick={(e)=>handleWishList(e)} children={"Save Product"} />
        </div>
      </div>
      <Button type="submit" children={"Add Product"} className="mt-4" />
    </form>
  </>;
}
export {
  AddOrder as default
};
