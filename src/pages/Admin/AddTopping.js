import React, { useContext, useState } from "react";
import {
    Container,
    Image,
    Form,
    Row,
    Col,
    Button,
}
from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../../components/contexts/userContext";
import { useMutation } from "react-query";
import { API } from "../../config/api";

const AddTopping = () => {
    const navigate = useNavigate();
    const [state] = useContext(UserContext);

    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        title: "",
        desc: "",
        price: 0,
        image: "",
        qty: 0,
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
            e.target.type === "file" ? e.target.files : e.target.value,
        });

        if (e.target.type === "file") {
            let url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            const formData = new FormData()
            formData.set("image", form.image[0], form.image[0].name);
            formData.set("title", form.name);
            formData.set("price", form.price);

            const data = await API.post("/topping", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                },
            });
            navigate("/");
        } catch (error) {
          console.log(error);
        }
      });

    return (
       <Container>        
        <Row className="mt-5">
        <Form onSubmit={(e) => handleSubmit.mutate(e)} >
            <Col className="mt-5">
                <h1 style={{color: "red"}}>Topping</h1>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label></Form.Label>
                <input name="name" onChange={handleChange} type="name" placeholder="title" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label></Form.Label>
                <input name="price" onChange={handleChange} type="number" placeholder="Price" />
            </Form.Group>
            <Form.Group controlId="formFileSm" className="mb-3">
                <Form.Label></Form.Label>
                <input onChange={handleChange} name="image" type="file" size="sm" placeholder="Photo Product" />        
            </Form.Group>
            <Button variant="danger" className="btn-nav w-25 mt-5" type="submit">Add Topping</Button>
            </Col>            
            <Col className="col-12 col-lg-5 mt-5">
            {preview && (
                <Image src={preview} style={{maxWidth: "150px", maxHeight: "150px", objectFit: "cover"}} alt={preview} />
                )}
            </Col>
            </Form>
        </Row>     
    </Container>
    );
}

export default AddTopping;