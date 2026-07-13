import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Button from "@/components/ui/button/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { OrderTable } from "@/components/tables/OrderTable";

function AddOrder() {

  //validation schema for the form
  const schema = yup.object({
    payment_method: yup.string().required(),
    status: yup.string().required(),
    shipping_address: yup.string().required(),
    product_id: yup.number().positive().integer().required(),
    unit_price: yup.number().positive().required(),
    total_price: yup.number().positive().required(),
    quantity: yup.number().positive().required(),
    user_id: yup.number().positive().integer().required(),
    total_amount: yup.number().positive().required(),
    product_name: yup.string().required()
  }).required()

  const {register, handleSubmit, formState:{errors}} = useForm({
    resolver: yupResolver(schema),
    defaultValues:{
      payment_method: "",
      status: "",
      shipping_address: "",
      product_name:"",
      
      order_details: [
        {
          product_id: "",
          unit_price: "",
          total_price: "",
          quantity: "",
          user_id: "",
          total_amount: "",
        }
      ]
    }
  })

function handleAddOrder(e) {
  e.preventDefault();
  console.log("order addition running")
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
              <Input
                className="w-full"
                name="customer_name"
                placeholder="John Doe"
                {...register("user_id")}
              />
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
            className="w-full"
            name="status"
            placeholder="Pending"
          />
          {errors.status && <p className="text-red-500">{errors.status.message}</p>}
        </div>
      </div>
      <hr className="my-4" />
      <OrderTable />
      <Button type="submit" children={"Add Product"} className="mt-4" />
    </form>
  </>;
}
export {
  AddOrder as default
};
