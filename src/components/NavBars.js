import React, { useContext, useEffect, useState } from "react";
import "../style/index.css";
import { 
  Container,
  Navbar,  
  NavbarBrand, 
  Dropdown,
  Badge,
  Button,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import logo from "../Assets/Logo/waysbucks.png";
import userIcon from "../Assets/Img/user-icon.svg";
import logoutIcon from "../Assets/Img/logout-icon.svg";
import cart from "../Assets/Img/cart.svg";
import addProduct from "../Assets/Img/add-product.svg";
import addTopping from "../Assets/Img/add-topping.svg";
import BlankProfile from "../Assets/Img/blankProfile.jpg";


import LoginForm from "./Auth/LoginForm";
import RegisterForm from "./Auth/RegisterForm";
import { CartContext } from "../components/contexts/CartContext";
import { UserContext } from "./contexts/userContext";
import { API } from "../config/api";

const Navbars = () => {
    const navigate = useNavigate();

    const { dataCart, setDataCart } = useContext(CartContext);
    const [state, dispatch] = useContext(UserContext);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    console.log(dataCart);

    const handleLogout = () => {
      dispatch({
        type: "LOGOUT",
      });
      navigate("/");
    };

    const [user, setUser] = useState(null);

    const getUser = async () => {
      const response = await API.get(`/user/${state.user.id}`);
      console.log(response);
      setUser(response.data.data);
    };

    const getCart = async () => {
      const response = await API.get(`/cart-status`);
      setDataCart(response.data.data.length);
    };

    useEffect(() => {
      getUser();      
    }, [state]);  

    return ( 
        <div>
        <Navbar bg="light" expand="lg" className="shadow-sm">
            <Container>
                <Link to="/" style={{ textDecoration: "none" }}>
                <NavbarBrand>
                    <img 
                        src={logo}
                        alt="dumbways"
                        width="50" 
                        className="dumbways-logo"
                        />
                </NavbarBrand>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse
                    id="responsive-navbar-nav"
                    className="justify-content-end"
                >
                    {!state.isLogin ? (
                    <div>
                    <Button
                        className="btn-login"
                        variant="outline-danger"
                        onClick={() => setShowRegister(true)}
                    >
                      Register
                    </Button>
                    <Button
                        className="btn-register"
                        variant="danger"
                        onClick={() => setShowLogin(true)}
                    >
                      Login
                    </Button>
                  </div>
                    ) : state.user.role === "user" ? (
                <div>
                <Dropdown>
                {dataCart > 0 && (
                    <Badge
                      style={{ width: "20px", height: "20px" }}
                      className="bg-danger position-absolute badge"
                    >
                      {dataCart}
                    </Badge>
                  )}                
                    <img 
                    src={cart} 
                    width= "30"                  
                    className="mx-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/cart-order")}
                    />
                                                                                
                  <Dropdown.Toggle variant="bg-light" id="dropdown-basic">
                    <img src={BlankProfile} width="30" style={{borderRadius: "100%"}} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate("/profile")}>
                      <img className="me-3" src={userIcon} width="30" />
                      Profile
                    </Dropdown.Item>                    
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={handleLogout}
                    >
                      <img className="me-3" src={logoutIcon} width="30" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
                    ) : (
                      <div>
                <Dropdown>
                  <Dropdown.Toggle variant="bg-yellow" id="dropdown-basic">
                    <img src={BlankProfile} width="30" style={{borderRadius: "100%"}} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate("/add-product")}>
                      <img className="me-3" src={addProduct} width= "25" />
                      Add Product
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/add-topping")}>
                      <img className="me-3" src={addTopping}  width= "25" />
                      Add Topping
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/transaction")}>
                      <img className="me-3" src={cart}  width= "25" />
                      Transaction
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={handleLogout}
                    >
                      <img className="me-3" src={logoutIcon} width="25" /> 
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <LoginForm
         show={showLogin}
         setShow={setShowLogin}         
         setIsLogin={setIsLogin}
         setShowRegister={setShowRegister}         
         />

                    
        <RegisterForm
          show={showRegister}
          setShow={setShowRegister}                   
          setShowLogin={setShowLogin}
          />
        </div>
     );
}
 
export default Navbars;