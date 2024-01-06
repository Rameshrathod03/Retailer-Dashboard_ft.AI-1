import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layout/AuthLayout";
import Layout from "./layout/Layout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/home";
import ProfileForm from "./pages/profile";

import Customers from "./pages/customers";
import AddOrder from "./pages/customers/forms/AddOrder";
import CustomerInfo from "./pages/customers/info";

import Inventory from "./pages/inventory";
import AddItem from "./pages/inventory/forms/AddItem";
import EditItem from "./pages/inventory/forms/EditItem";
import AddCategory from "./pages/inventory/forms/AddCategory";
import DeleteCategory from "./pages/inventory/forms/DeleteCategory";

import Marketing from "./pages/marketing";

import Market from "./pages/market"

import { AuthContextProvider } from "./firebase";

import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
    <AuthContextProvider>
      <main className="app">
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/" element={<Layout />}>
            {/* <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
            <Route path="profile" element={<ProtectedRoute><ProfileForm /></ProtectedRoute>} />
            <Route path="customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="customers/add-order" element={<ProtectedRoute><AddOrder /></ProtectedRoute>} />
            <Route path="customers/:phone" element={<ProtectedRoute><CustomerInfo /></ProtectedRoute>} />
            <Route path="inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="add-item" element={<ProtectedRoute><AddItem /></ProtectedRoute>} />
            <Route path="edit-item/:itemId" element={<ProtectedRoute><EditItem /></ProtectedRoute>} />
            <Route path="add-category" element={<ProtectedRoute><AddCategory /></ProtectedRoute>} />
            <Route path="delete-category" element={<ProtectedRoute><DeleteCategory /></ProtectedRoute>} />
            <Route path="marketing" element={<ProtectedRoute><Marketing /></ProtectedRoute>} />
            <Route path="market-analysis" element={<ProtectedRoute><Market /></ProtectedRoute>} />
          </Route>
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </AuthContextProvider>
  );
}

export default App;
