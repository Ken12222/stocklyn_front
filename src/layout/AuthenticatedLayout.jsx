import { useNavigate, Navigate, Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

function AuthenticatedLayout({ allowedRoles }) {

  const location = useLocation();
  const navigate = useNavigate()
  const { auth, isFetching } = useAuth();
  const hasAccess = allowedRoles.includes(auth?.role);

  if (isFetching) return <div>Loading</div>

  return <div>
    {auth && hasAccess
      ? <Outlet />
      :
      <Navigate to="/signin" state={{ from: location }} replace />
    }
  </div>;
}

export {
  AuthenticatedLayout as default
};
