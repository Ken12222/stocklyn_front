import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import Register from "./pages/AuthPages/Register";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Products from "./pages/Ecommerce/Products/Products";
import AddProduct from "./pages/Ecommerce/Products/Add_product";
import Invoices from "./pages/Ecommerce/Orders/Orders";
import AddInvoice from "./pages/Ecommerce/Orders/Add_Order";
import Orders from "./pages/Ecommerce/Orders/Orders";
import Warehouses from "./pages/Warehouses/Warehouses";
import Warehouse from "./pages/Warehouses/Warehouse";
import Transfers from "./pages/Transfers/Transfers";
import SingleInvoice from "./pages/Ecommerce/Orders/Single_Order";
import AddOrder from "./pages/Ecommerce/Orders/Add_Order";
import SingleProduct from "./pages/Ecommerce/Products/SingleProduct";
import AuthenticatedLayout from "./layout/AuthenticatedLayout";
import api from "./hooks/axios";
import { Fragment, useEffect } from "react";
import { Toaster } from "sonner";
import Staff from "./pages/Staff/Staff";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 80),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
  auth: {
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  },
});

function App() {

  useEffect(() => {
    // Initialize CSRF cookie once
    api.get("/sanctum/csrf-cookie").catch(err => console.error("CSRF Init Error:", err));
  }, []);

  return (
    <Fragment>
      <Router>
        <ScrollToTop />
      <Toaster />
      <Routes>
        {/* Dashboard Layout */}
        <Route element={<AuthenticatedLayout allowedRoles={["admin", "rep"]} />}>
          <Route element={<AppLayout />}>

            {/* Products Pages */}
            <Route index path="/" element={<Home />} />
            <Route path="/products/" element={<Products />} />
            <Route path="/add_product" element={<AddProduct />} />
            <Route path="/products/:id" element={<SingleProduct />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/:id" element={<SingleInvoice />} />
            <Route path="/add_invoice" element={<AddInvoice />} />

            {
              /* Orders Pages */
            }
            <Route path="/orders/" element={<Orders />} />
            <Route path="/orders/add_orders" element={<AddOrder />} />
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />

            <Route element={<AuthenticatedLayout allowedRoles={["admin"]} />}>
              {
                /* Warehouses Pages */
              }
              <Route path="/warehouses/" element={<Warehouses />} />
              <Route path="/warehouses/:id" element={<Warehouse />} />
              {
                /* Warehouses Pages */
              }
              <Route path="/staff/" element={<Staff />} />
              <Route path="/warehouses/:id" element={<Warehouse />} />

              {
                /* Warehouses Pages */
              }
              <Route path="/transfers/" element={<Transfers />} />
              <Route path="/warehouses/:id" element={<Warehouse />} />

              {/* Register Page */}
              <Route path="/register" element={<Register />} />
            </Route>
          </Route>
        </Route>

        {
          /* Sign In Page */
        }
        <Route path="/signin" element={<SignIn />} />

        {
          /* Fallback Route */
        }
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </Fragment>
  );
}
export {
  App as default
};
