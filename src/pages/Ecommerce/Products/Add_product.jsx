import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import TextArea from "../../../components/form/input/TextArea";
import FileInput from "../../../components/form/input/FileInput";
import Button from "@/components/ui/button/Button";
import usePost from "@/hooks/Api/usePost";
import useFetch from "@/hooks/Api/useFetch";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";

function AddProduct() {

  const { data, mutate: createProduct, error, isLoading, isSuccess } = usePost("/api/products");
  const { data: categoryData, isLoading: categoriesLoading, error: categoriesError } = useFetch("/api/categories");

  const normalizeCategoryOptions = (payload) => {
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.categories)
          ? payload.categories
          : [];

    return list.map((category) => ({
      value: category?.id ?? category?.category_id ?? "",
      label: category?.name ?? category?.title ?? category?.category_name ?? "Unnamed category",
    }));
  };

  const categoryOptions = normalizeCategoryOptions(categoryData);

  const schema = yup.object({
    name: yup.string().required(),
    category_id: yup.number().positive().integer().nullable(),
    price: yup.number().positive().required(),
    status: yup.string(),
    image: yup.mixed().nullable(),
    quantity: yup.number().positive().integer().required(),
    // description: yup.string().nullable()
  }).required()

  const {register, handleSubmit, formState:{errors}} = useForm({
    resolver: yupResolver(schema),
    defaultValues:{
    name: "",
    category_id: "",
    price: "",
    status: "",
    image: "",
    quantity: "",
    }
  })

  async function handleCreateProduct(formData) {
    createProduct(formData, {
      onSuccess: () => {
        toast.success("Product has been added successfully", {
          position: "top-center"
        })
      },
      onError: () => {
        toast.error("Failed to add Product. Please try again later", {position:"top-center"})
      }
    })
  }

  return <>
    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">
      Add Product
    </h3>
    <form onSubmit={handleSubmit(handleCreateProduct)} className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h6 className="text-lg text-gray-800 dark:text-white/90">
            Product Description
          </h6>
          <p className="text-gray-400 text-sm">
            Track your store's progress to boost your sales
          </p>
        </div>
      </div>
      {isSuccess && toast.success(data?.message, {position:"top-center"})}
  
      <div className="w-full md:grid grid-cols-2 gap-4">
        <div>
          <Label children={"Product Name"} htmlFor="product_name" />
          <Input
            className="w-full"
            name="name"
            placeholder="Enter product name"
            {...register("name")}
          />
          {error?.errors.name && error?.errors.name.map((msg, index) => (
            <p key={index} className="text-sm py-2 text-error-500">
              {msg}
            </p>
          ))}

          {/* error message from react form */}
          {errors.name && 
            <p className="text-sm py-2 text-error-500">
              {errors.name.message}
            </p>
          }
        </div>
        <div>
          <Label children={"Price"} htmlFor="Price" />
          <Input
            className="w-full"
            name="name"
            placeholder="Enter Price"
            {...register("price")}
          />
          {error?.errors.price && error?.errors.price.map((msg, index) => (
            <p key={index} className="text-sm py-2 text-error-500">
              {msg}
            </p>
          ))}
                    {/* error message from react form */}
          {errors.price && 
            <p className="text-sm py-2 text-error-500">
              {errors.price.message}
            </p>
          }
        </div>
        <div>
          <Label children={"Quantity"} htmlFor="quantity" />
          <Input
            className="w-full"
            name="quantity"
            placeholder="Enter Quantity"
            {...register("quantity")}
          />
          {error?.errors.quantity && error?.errors.quantity.map((msg, index) => (
            <p key={index} className="text-sm py-2 text-error-500">
              {msg}
            </p>
          ))}
                    {/* error message from react form */}
          {errors.quantity && 
            <p className="text-sm py-2 text-error-500">
              {errors.quantity.message}
            </p>
          }
        </div>

        <div>
          <Label children={"Category"} htmlFor="category_id" />
          <Select
            options={categoryOptions}
            placeholder={categoriesLoading ? "Loading categories..." : "Select a category"}
            disabled={categoriesLoading}
            {...register("category_id")}
          />
          {categoriesError && (
            <p className="text-sm py-2 text-error-500">
              Unable to load categories.
            </p>
          )}
          {error?.errors.category_id && error?.errors.category_id.map((msg, index) => (
            <p key={index} className="text-sm py-2 text-error-500">
              {msg}
            </p>
          ))}
          {/* error message from react form */}
          {errors.category_id && 
            <p className="text-sm py-2 text-error-500">
              {errors.category_id.message}
            </p>
          }
        </div>
      </div>
      <div className="overflow-hidden mt-4 rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className=" sm:flex-row sm:items-center sm:justify-between" />
        <Label children={"Product Image"} htmlFor="product_image" />
        <FileInput
        {...register("image")} />
        {error?.errors.image && error?.errors.image.map((msg, index) => (
          <p key={index} className="text-sm py-2 text-error-500">
            {msg}
          </p>
        ))}
                  {/* error message from react form */}
          {errors.image && 
            <p className="text-sm py-2 text-error-500">
              {errors.image.message}
            </p>
          }
      </div>
      <Button type="submit" children={"Add Product"} className="mt-4" />
    </form>
  </>;
}
export {
  AddProduct as default
};
