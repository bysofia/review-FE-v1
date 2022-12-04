import React, { useContext, useEffect, useState } from "react";
import { 
  Container,
  Image,
  Button,  
  Form,  
 } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from "react-query";
import { API } from "../config/api";

export const ProductDetail = () => {
    const title = "Product";
    document.title = "WaysBucks | " + title; 

        // toping
    const [toping, setToping] = useState([]); //price
    const [topping_id, setIdToping] = useState([]); //id

    //check mark
    const handleChange = (e) => {
        let updateToping = [...toping];
        if (e.target.checked) {
          updateToping = [...toping, e.target.value];
        } else {
          updateToping.splice(toping.indexOf(e.target.value));
        }
        setToping(updateToping);
    
        let toppingId = [...topping_id];
        if (e.target.checked) {
          toppingId = [...topping_id, parseInt(e.target.id)];
        } else {
          toppingId.splice(topping_id.indexOf(e.target.id));
        }
    
        setIdToping(toppingId);
      };

        // fatching
    let { id } = useParams();
    let { data: product } = useQuery("productCache", async () => {
        const response = await API.get("/product/" + id);
        return response.data.data;
    });

    let { data: toppings } = useQuery("toppingsCache", async () => {
        const response = await API.get("/toppings");
        return response.data.data;
      });

    
        // price sum
    let resultTotal = toping.reduce((a, b) => {
        return a + parseInt(b);
    }, 0);

    let subtotal = product?.price + resultTotal;
    let qty = 1;
    

    const handleSubmit = useMutation(async (e) => {
        try {
          e.preventDefault();
    
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
    
          await API.post("/transaction", config);
    
          const body = JSON.stringify({
            topping_id: topping_id,
            subtotal: subtotal,
            product_id: parseInt(id),
            qty: qty,
          });
    
          await API.post("/cart", body, config);
    
          setIdToping([]);
          setToping([]);
        } catch (error) {
          console.log(error);
        }
      });


return(
    <Container
    className="row m-auto"
    style={{padding : "30px 90px"}}
    >
        <div className="mb-4 col-5 pe-5">
            <Image src={product?.image} width="100%"/>
        </div>
        <div className="col-7" style={{ fontSize: "1.15rem" }}>
            <h3 className="fs-1 fw-bolder mb-3 text-danger">{product?.title}</h3>
            <p className="fs-4 fw-semibold mb-5" style={{color : "#984c4c"}}>Rp.{product?.price}</p>
            <p className="fs-2 fw-bold" style={{color : "#984c4c"}}>Toping</p>
            <div className="row">
                {toppings?.map((item, index) => (
                    <div className='col-3 text-center p-0 mb-2 mt-3' key={index}> 
                     <label htmlFor={item?.id}   >                        
                                                  
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Image src={item?.image} className="w-50 mb-2"/> 
                            <Form.Check name="topping" type="checkbox" label={item?.title} id={item?.id} onChange={handleChange} value={item?.price} />                            
                        </Form.Group>
                    </label>    
                    </div>
                ))}
            </div>
            <div className='row justify-content-between mt-5 mb-3' style={{color : "#984c4c"}}>
                <p className="col-3 fs-4 fw-bolder">Total</p>
                <p className="col-3 fs-4 fw-bolder text-end">Rp. {product?.price + resultTotal}</p>
            </div>
            <Button 
            variant='danger' 
            className="w-100 fw-bold"            
            onClick={(e) => handleSubmit.mutate(e)}
            >Add Cart</Button>
        </div>
    </Container>
)
}