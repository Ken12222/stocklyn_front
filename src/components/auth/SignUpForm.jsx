import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePost from "@/hooks/Api/usePost";
import useFetch from "@/hooks/Api/useFetch";
import { useWarehouseStore } from "@/store/WarehouseStore";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { data: warehouseResponse, isLoading: isWarehousesLoading } = useFetch("api/warehouses");
  const setWarehouses = useWarehouseStore((state) => state.setWarehouses);
  const storedWarehouses = useWarehouseStore((state) => state.warehouses);

  useEffect(() => {
    if (warehouseResponse) {
      setWarehouses(warehouseResponse);
    }
  }, [warehouseResponse, setWarehouses]);

  const warehouseOptions = useMemo(() => {
    const warehouseList = storedWarehouses?.warehouses ?? [];

    if (Array.isArray(warehouseList)) {
      return warehouseList.map((warehouse) => ({
        value: warehouse.id?.toString(),
        label: warehouse.name,
      }));
    }

    return [];
  }, [storedWarehouses]);

  const schema = yup.object({
    fname: yup.string().required(),
    lname: yup.string().required(),
    email: yup.string().email().required(),
    role: yup.string().required(),
    warehouse_id: yup.string().required(),
    password: yup.string().min(8).required(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      role: "",
      warehouse_id: "",
      password: "",
    },
  });

  const { mutate } = usePost("/register");
  const selectedWarehouseId = watch("warehouse_id");

  function registerStaff(data) {
    mutate(data);
  }

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10" />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 text-gray-800 text-title-sm dark:text-white/90 sm:text-title-sm">
              Add A Staff
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Provide staff details to create a new account for them!
            </p>
          </div>

          <div>
            <form onSubmit={handleSubmit(registerStaff)}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      {...register("fname")}
                      placeholder="Enter your first name"
                      name="fname"
                    />
                    {errors?.fname && <p className="text-red-500 text-sm">{errors?.fname?.message}</p>}
                  </div>

                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      name="lname"
                      {...register("lname")}
                      placeholder="Enter your last name"
                    />
                    {errors?.lname && <p className="text-red-500 text-sm">{errors?.lname?.message}</p>}
                  </div>
                </div>

                <div>
                  <Label>
                    Warehouse<span className="text-error-500">*</span>
                  </Label>
                  <Combobox
                    items={warehouseOptions}
                    value={selectedWarehouseId}
                    onValueChange={(value) => setValue("warehouse_id", value, { shouldValidate: true })}
                  >
                    <ComboboxInput
                      placeholder={isWarehousesLoading ? "Loading warehouses..." : "Select a warehouse"}
                      className="w-full"
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No warehouses found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.value} value={item.value}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {errors?.warehouse_id && <p className="text-red-500 text-sm">{errors?.warehouse_id?.message}</p>}
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <Label>
                      Email<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      {...register("email")}
                      placeholder="Enter your email"
                    />
                    {errors?.email && <p className="text-red-500 text-sm">{errors?.email?.message}</p>}
                  </div>

                  <div>
                    <Label>
                      Role<span className="text-error-500">*</span>
                    </Label>
                    <Input type="text" {...register("role")} placeholder="Enter your role" />
                    {errors?.role && <p className="text-red-500 text-sm">{errors?.role?.message}</p>}
                  </div>
                </div>

                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                    />
                    {errors?.password && <p className="text-red-500 text-sm">{errors?.password?.message}</p>}
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />}
                    </span>
                  </div>
                </div>

                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Sign Up
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
