import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layout/AuthLayout";
import Layout from "./layout/Layout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/home";
import Customers from "./pages/customers";
import CustomerInfo from "./pages/customers/info";

const App = () => {
  return (
    <main className="app">
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/*" element={<Layout />}>
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:customerId" element={<CustomerInfo />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
