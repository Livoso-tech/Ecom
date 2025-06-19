import { createBrowserRouter } from "react-router-dom";
import App from '../App'
import Home from '../pages/Home'
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import SignUp from "../pages/SignUp";
import AdminPenal from "../pages/AdminPenal";
import AllUser from "../pages/AllUser";
import AllProduct from "../pages/AllProduct";
import CatagoryProduct from "../pages/CatagoryProduct";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import SearchProduct from "../pages/SearchProduct";
import FAQ from "../components/Faq";
import AdminLayout from "../components/Admin/AdminLayout";
import AdminDashboard from "../components/Admin/AdminDashBoard";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />

            },
            {
                path: "Login",
                element: <Login />
            },
            {
                path: "Forgot-Password",
                element: <ForgotPassword />
            },
            {
                path: "sign-up",
                element: <SignUp />
            },
            {
                path: "product-category/:catagoryName",
                element: <CatagoryProduct />
            },
            {
                path: 'product/:id',
                element: <ProductDetails />
            }, 
            {
                  path: 'Cart',
                    element: <Cart />

            },
            {
             path:'/search',
                element:<SearchProduct />
            }  ,     
            {
             path:'/faq',
                element:<FAQ />
            }  ,   
            {
                path:"admin",
                element: <AdminLayout />,
                children: [
                     {
                        path: "",
                        element: <AdminDashboard />
                    }, {
                        path: "all-user",
                        element: <AllUser />
                    },
                    {
                        path: "all-product",
                        element: <AllProduct />
                    },
                ]

            }  ,
           
            {
                path: "admin-penal",
                element: <AdminPenal />,
                children: [
                    {
                        path: "all-user",
                        element: <AllUser />
                    },
                    {
                        path: "all-product",
                        element: <AllProduct />
                    }
                ]
            }



        ]
    }
])
export default router