import { useContext, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Drinks } from "../components/DataDummy/Drinks";
import { UserContext } from "../components/contexts/userContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { API } from "../config/api";

const ContentPatner = () => {
  const navigate = useNavigate(); 
  const [state] = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleShow = () => {
    setShowLogin(true);
  };

  let { data: product } = useQuery("contentPatnerCache", async () => {
    const response = await API.get(`/products`);
    return response.data.data;
  });

  // const admin = product?.filter((product) => product.role === "admin");
  // console.log(admin);

  return (
    <Container>
      <h2 className="mt-5 mb-3" style={{color: "red"}} >Lets Order</h2>
      <Row>
        {product?.map((item) => (
          <Col className="my-3 col-12 col-md-3">
            <Card 
            width= "16rem" 
            className="shadow"
            style={{ cursor: "pointer" }}
              key={item?.id} 
              onClick={() => {                
                !state.isLogin ? handleShow(true) : navigate(`/product-detail/${item?.id}`);
              }}
            >
              <Card.Img variant="top" src={item?.image} alt="drinks" />
              <Card.Body>
                <Card.Text className="font-bold">{item?.title}</Card.Text>
                <Card.Text className="text-price">Rp. {item?.price}</Card.Text>                
              </Card.Body>
            </Card>
          </Col>
        ))}       
      </Row>
    </Container>
  );
};

export default ContentPatner;