import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,  
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { empty } from "../Assets/Logo/empty.png";
import { carts } from "../components/DataDummy/Cart";
import trash from "../Assets/Img/trash-icon.svg";
import { API } from "../config/api";
import { useMutation, useQuery } from "react-query";

function Order() {
  const title = "Cart";
  document.title = "WaysBucks | " + title;

  let navigate = useNavigate();

  // cart
  let { data: cart, refetch } = useQuery("cartsCache", async () => {
    const response = await API.get("/carts-id");
    return response.data.data;
  });

  // subtotal
  let resultTotal = cart?.reduce((a, b) => {
    return a + b.subtotal;
  }, 0);

  // remove
  let handleDelete = async (id) => {
    await API.delete(`/cart/` + id);
    refetch();
  };

  // pay
  const form = {
    status: "pending",
    total: resultTotal,
  };

  const handleAdd = useMutation(async ({id, qty, price}) => {
    const updateQty = cart.length + 1
    const updateTotal = price * updateQty
    const req = {
      qty: updateQty,
      sub_amount: updateTotal
    }
    await API.patch(`/cart`, req)
  })

  const handleSubmit = useMutation(async (e) => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    // Insert transaction data
    const body = JSON.stringify(form);
    const response = await API.patch("/transaction", body, config);
    const token = response.data.data.token;

    window.snap.pay(token, {
      onSuccess: function (result) {
        console.log(result);
        navigate("/profile");
      },
      onPending: function (result) {
        console.log(result);
        navigate("/profile");
      },
      onError: function (result) {
        console.log(result);
      },
      onClose: function () {
        alert("you closed the popup without finishing the payment");
      },
    });

    await API.patch("/cart", body, config);
  });
  //

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    //change this according to your client-key
    const myMidtransClientKey = "SB-Mid-client-4vZOaNa01asv4lzL";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

    useEffect(() => {
      //change this to the script source you want to load, for example this is snap.js sandbox env
      const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
      //change this according to your client-key
      const myMidtransClientKey = "SB-Mid-client-4vZOaNa01asv4lzL";
    
      let scriptTag = document.createElement("script");
      scriptTag.src = midtransScriptUrl;
      // optional if you want to set script attribute
      // for example snap.js have data-client-key attribute
      scriptTag.setAttribute("data-client-key", myMidtransClientKey);
    
      document.body.appendChild(scriptTag);
      return () => {
        document.body.removeChild(scriptTag);
      };
    }, []);

  return (
    <Container>  
    <Row className="mt-5">  
      <h2 className="mt-5" style={{color: "red"}} >My Cart</h2> 
    </Row>   
      <h5 className=" mb-3" style={{color: "red"}} >Review Your Order</h5>      
      <div className="mt-4">        
        <Row>
          <Col className="col-lg-8">
            <hr />
          </Col>
          <Col className="d-none d-lg-block">
            <hr />
          </Col>
        </Row>
        <Row>
          <Col>
            {cart?.map((item, index) => (
              <Col key={index}>
                <Row className="d-flex align-items-center">
                  <Col>
                    <Row className="d-flex align-items-center text-start">
                      <Col className="col-3">
                        <img
                          src={item.product?.image}
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      </Col>
                      <Col className="col-9 ps-5 ps-lg-0">
                        <h6 className="my-3 fw-bold" style={{color: "red"}}>{item.product.title}</h6>
                        <div className="row">
                           <p className="col-2 fw-bold pe-0" style={{color : "red"}}>Toping :</p>
                           <div className="col-9 ps-0">
                              {item.topping?.map((topping, idx) => (
                                 <span key={idx} className="fw-semibold fs-6 text-danger">{topping.title},</span>
                              ))}
                           </div>
                        </div>
                        <h6 className="my-3">
                        <Button 
                        className="border-0 rounded text-dark"
                        variant="outline-danger"
                        //onClick={() => handleLess.mutate({id:item.id, qty:item.qty, price:item.product.price, sub_amount:item.sub_amount})}                         
                        >
                          -
                        </Button>
                            {item.qty}
                        <Button 
                        className="border-0 rounded text-dark"
                        variant="outline-danger"
                        onClick={() => handleAdd.mutate({id:item.id, qty:item.qty, price:item.product.price})}           
                        >
                          +
                        </Button>
                        </h6>
                      </Col>
                    </Row>
                  </Col>
                  <Col className="col-4 text-end">
                    <h6 className="text-danger my-3">Rp. {item.product?.price}</h6>
                    <h6 className="text-danger my-3">
                    <Button className="bg-light border-0 rounded text-dark"
                        onClick={() => handleDelete(item.id)}                        
                        >
                      <img src={trash} />
                    </Button>
                    </h6>
                  </Col>
                </Row>
                <hr />
              </Col>
            ))}
            <Col className="col-12 col-lg-4">
            <Col>
              <Row className="d-flex align-items-center mt-2">
                <Col>
                  <Row className="d-flex align-items-center text-start">
                    <Col>
                      <h6 style={{color: "red"}}>Subtotal</h6>
                      <h6 style={{color: "red"}}>Qty</h6>                     
                    </Col>
                    <Col className="text-end">
                      <h6 style={{color: "red"}}>Rp. {resultTotal}</h6>
                      <h6 style={{color: "red"}}>{cart?.length}</h6>                     
                    </Col>
                  </Row>
                </Col>
              </Row>
              <hr style={{ marginTop: "30px" }} />
            </Col>
            <Col>
              <Row className="d-flex align-items-center">
                <Col>
                  <Row className="d-flex align-items-center text-start text-danger">
                    <Col>
                      <h6 style={{color: "red"}}>Total</h6>
                    </Col>
                    <Col className="col-4 text-end">
                      <h6 style={{color: "red"}}>Rp. {resultTotal}</h6>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Col>                    
          </Col>

          <Col className="col-12 col-lg-4">
            <Col>
              <Row className="d-flex align-items-center mt-2">
                <Col>
                  <Row className="d-flex align-items-center text-start">
                  <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label></Form.Label>
                            <Form.Control type="email" placeholder="Name" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label></Form.Label>
                            <Form.Control type="email" placeholder="Email" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label></Form.Label>
                            <Form.Control type="email" placeholder="Phone" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label></Form.Label>
                            <Form.Control type="email" placeholder="Post Code" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label></Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Address" />
                        </Form.Group>
                    </Form>                                    
                  </Row>
                </Col>
              </Row>              
            </Col>            
          </Col>
        </Row>

        <div>
          <Button
            variant="danger"
            className="btn-nav px-5 f-14 fw-bold float-end my-2 w-25"
            onClick={(e) => handleSubmit.mutate(e)}
          >
            Pay
          </Button>
          <Modal
            size="xl"            
            aria-labelledby="example-modal-sizes-title-lg"
          >            
          </Modal>
        </div>
      </div>
    </Container>
  );
}

export default Order;
