import React, { useState } from "react";
import { useMutation } from 'react-query';
import { API } from "../../config/api";
import { Button, Form, Modal, Alert } from "react-bootstrap";

import FormAll from "../Atom/FormAll";
import { Await } from "react-router-dom";
import { AlertFail } from "../Atom/Alert";
import { AlertSuccess } from "../Atom/Alert";

const RegisterForm = ({
    show,
    setShow,
    setShowLogin,
}) => {

    const [message, setMessage] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        role: '',
    });  
   
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            const res = await API.post("/register", form);
            const alert = (
                <AlertSuccess title="Success, " desc="Registration Successfull" />
            );
            console.log(res);
            setTimeout(() => {
                setShow(false);
                setShowLogin(true);
            }, 2000);

            setMessage(alert);
        } catch (error) {
            console.log(error);
            const alert = (
                <AlertFail title="Failed !" desc={error.response.data.message} />
            );

            setMessage(alert)
        }
    });        

    return (
    <> 
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >        
      <Modal.Body>
        <Form 
        onSubmit={(e) => handleSubmit.mutate(e)} 
        style={{width: "100px flex", margin: "100px auto"}}
        >
            <h2 className="tex-center fw-bold" style={{color: "red"}}>Register</h2>

            <Form.Group className="my-3 mt-4">
                <Form.Label className="fw-semibold fs-5"></Form.Label>
                <FormAll 
                style={{border: "5", borderColor: "red"}}
                name="email" 
                label="Email" 
                type="email" 
                placeholder="Email"
                onChange={handleChange}                
                required
                />
            </Form.Group>
            <Form.Group className="my-3">
                <Form.Label className="fw-semibold fs-5"></Form.Label>
                <FormAll 
                style={{border: "5", borderColor: "red"}} 
                name="password"
                label="Password" 
                type="password" 
                placeholder="Password" 
                onChange={handleChange}               
                required
                />
            </Form.Group>
            <Form.Group className="my-3">
                <Form.Label className="fw-semibold fs-5"></Form.Label>
                <FormAll 
                style={{border: "5", borderColor: "red"}} 
                name="name"
                label="Full Name" 
                type="text" 
                placeholder="Full Name"
                onChange={handleChange}                
                required
                />
            </Form.Group>
            <Form.Group className="my-3">
            <Form.Select 
            style={{border: "5", borderColor: "red"}}
            aria-label="Default select example m-5 fs-5"
            name="role"            
            onChange={handleChange}
            id="role"
            required
            >
                  <option hidden style={{border: "5", borderColor: "red"}}>Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
            </Form.Select>
            </Form.Group>
            <div className="d-grid gap-2">
                <Button variant="danger" size="lg" type="submit"  onClick={() => setShow(false)}>
                    Register
                </Button>      
            </div>
            <div>
                <p>Already have an account ? Klik{" "}
            <span
              className="fw-bold"
              onClick={() => {
                setShow(false);
                setShowLogin(true);
              }}
            >
              Here
            </span></p>                
            </div>
        </Form>
    </Modal.Body>        
</Modal>
</>
    );
};

export default RegisterForm;