import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import usePost from "../../hooks/Api/usePost";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import useFetch from "@/hooks/Api/useFetch";

function SignInForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { auth, setAuth } = useAuth();

  const { mutate: login, data, error, isLoading, isError, isSuccess } = usePost("/login");

  async function handleLogin(e) {
    e.preventDefault();
    login(formData, {
      onSuccess: (data) => {
        setAuth(data?.user)
        navigate("/")
      }
    });
  }

  return <div className="flex flex-col flex-1">
    <div className="w-full max-w-md pt-10 mx-auto">

    </div>
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      <div>
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
        </div>
        <div>
          <form onSubmit={(e) => handleLogin(e)}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>{" "}
                </Label>
                <Input placeholder="info@gmail.com" type="text" autoComplete="off" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                //required
                />
                {error && error?.errors.email && error?.errors.email.map((msg, index) => (
                  <p key={index} className="text-sm py-2 text-error-500">
                    {msg}
                  </p>
                ))}
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>{" "}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  //required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />}
                  </span>
                  {error?.errors.password && error?.errors.password.map((msg, index) => (
                    <p key={index} className="text-sm py-2 text-error-500">
                      {msg}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div>
                <Button className="w-full" size="sm">
                  Sign in
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>;
}
export {
  SignInForm as default
};
