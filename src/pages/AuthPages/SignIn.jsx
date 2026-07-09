import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";


function SignIn() {
  const navigate = useNavigate();
  const { auth, isLoading } = useAuth();
  useEffect(() => {
    if (auth) {
      navigate("/")
    }
  }, [auth])

  if (isLoading) return <div>Loading...</div>

  return <>
    <PageMeta
      title="Stocklyn"
      description="A modern inventory & sales management web app for small to medium businesses"
    />
    {localStorage.getItem("status") && auth
      ? <Navigate to="/" replace />
      : <AuthLayout>
        <SignInForm />
      </AuthLayout>
    }
  </>;
}
export {
  SignIn as default
};
