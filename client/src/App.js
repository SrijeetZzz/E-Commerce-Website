import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomaPage";
import About from "./pages/About";
import Layout from "./components/layout/Layout";
import PrivacyPolicy from "./pages/Policy";
import Contact from "./pages/Contact";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import UserDashboard from "./pages/user/UserDashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateCategory from "./pages/admin/CreateCategory";
import CreateProduct from "./pages/admin/CreateProduct";
import UpdateProduct from "./pages/admin/UpdateProduct";
import Products from "./pages/admin/Product";
import Users from "./pages/admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategoryProduct";
import CartPage from "./pages/CartPage";
import AdminOrders from "./pages/admin/AdminOrders";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<CategoryProduct />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="user" element={<UserDashboard/>}/>
            <Route path="user/orders" element={<Orders/>}/>
            <Route path="user/profile" element={<Profile/>}/>
          </Route>
          <Route path="/dashboard" element={<AdminRoute/>}>
            <Route path="admin" element={<AdminDashboard/>}/>
            <Route path="admin/create-category" element={<CreateCategory/>}/>
            <Route path="admin/create-product" element={<CreateProduct/>}/>
            <Route path="admin/product/:slug" element={<UpdateProduct/>}/>
            <Route path="admin/products" element={<Products/>}/>
            <Route path="admin/users" element={<Users/>}/>
            <Route path="admin/orders" element={<AdminOrders/>}/>
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
