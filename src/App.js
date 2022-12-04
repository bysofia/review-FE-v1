import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState, useContext, useEffect } from "react";

import Navbars from "./components/NavBars";
import Home from "./pages/Home";
import Profile from "./pages/UserProfile";
import CartOrder from "./pages/CartOrder";
import { UserContext } from "./components/contexts/userContext";
import { CartContext } from "./components/contexts/CartContext"; 
import { ProductDetails } from "./pages/ProductDetails";
import AddProduct from "./pages/Admin/AddProduct";
import AddTopping from "./pages/Admin/AddTopping";
import Transaction from "./pages/Admin/Transaction";
import { API, setAuthToken } from "./config/api";


function App() {
 const [state, dispatch] = useContext(UserContext);

 const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/" />;  
 };

 const AdminRoute = () => {
  const role = state.user.role;
  return role === "admin" ? <Outlet /> : <Navigate to="/" />;
 };

 const checkUser = async () => {
  try {
    if (localStorage.token) {
      setAuthToken(localStorage.token);      
    }
    const response = await API.get("check-auth");
    console.log(response);

    let payload = response.data.data;
    payload.token = localStorage.token;

    dispatch({
      type: "USER_SUCCESS",
      payload,
    });
  } catch (error) {
    console.log(error);
  };
 };

 useEffect(() => {
  checkUser();
}, []);

const client = new QueryClient();

const [cartLength, setCartLength] = useState(0);
  

  return (
    <CartContext.Provider value={{ cartLength, setCartLength }}>
    <QueryClientProvider client={client}>       
        <Router> 
          <Navbars />                    
              <Routes>              
                  <Route path="/" element={<Home />} />
                  <Route exact path="/" element={<PrivateRoute />}>
                    <Route path="/cart-order" element={<CartOrder />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/product-detail/:id" element={<ProductDetails />} />
                  </Route>
                  <Route exact path="/" element={<AdminRoute />}>
                    <Route path="/add-product" element={<AddProduct />} />           
                    <Route path="/add-topping" element={<AddTopping />} />           
                    <Route path="/transaction" element={<Transaction />} /> 
                  </Route>
                  <Route path="*" element={<Navigate to="/" />} />           
              </Routes>         
        </Router>      
    </QueryClientProvider>
    </CartContext.Provider>
  );
};

export default App;
