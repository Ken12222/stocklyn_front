import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";
function SignUp() {
  return <>
      <PageMeta
    title="Stocklyn"
    description="A modern inventory & sales management web app for small to medium businesses"
  />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>;
}
export {
  SignUp as default
};
