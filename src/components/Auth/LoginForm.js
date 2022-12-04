import React, { useState, useContext } from 'react';
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { API } from '../../config/api';
import { UserContext } from '../contexts/userContext';

import FormAll from '../Atom/FormAll';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({
    show,
    setShow,
    setShowRegister,
}) => {   
    let navigate = useNavigate(); 
    const handleClose = () => setShow(false);

    const [state, dispatch] = useContext(UserContext);
    const [message, setMessage] = useState(null);

    const [form, setForm] = useState({
      email: '',
      password: '',          
    });

    const handleChange =(e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = useMutation(async (e) => {
      try {
        e.preventDefault()

        const response = await API.post('/login', form);

        const alert = (<Alert variant='Success' className='py-1'>
          Success
        </Alert>)
        setMessage(alert)
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data
        })
        navigate('/add-product')
        console.log("data berhasil ditambahkan", response.data.data)
      } catch (err) {
        const alert = (<Alert variant='danger' className='py-1'>
          Failed
        </Alert>)
        setMessage(alert)
        console.log(err)
      };
    });   

    return (
    <Modal
      show={show}
      onHide={handleClose}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >    
      <Modal.Body>
      {message && message}
      <Form onSubmit={(e) => handleSubmit.mutate(e)} style={{width: "500px auto", margin: "100px auto"}}>
            <h2 className="tex-center fw-bold" style={{color: "red"}}>Login</h2>
            <Form.Group className="my-3 mt-2">
                <Form.Label className="fw-semibold fs-5"></Form.Label>
                <FormAll 
                style={{border: "5", borderColor: "red"}} 
                name="email"
                label="Email" 
                type="email" 
                placeholder='Email'                
                onChange={handleChange}
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
                onChange={handleChange} />
            </Form.Group>
            <div className="d-grid gap-2">
                <Button variant="danger" size="lg" type='submit' >
                    Login
                </Button>      
            </div>
            <div>
                <p>Don't have an account ? Klik{" "}
            <span
              className="fw-bold"
              onClick={() => {
                setShow(false);
                setShowRegister(true);
              }}
            >
              Here
            </span></p>                
            </div>
        </Form>
      </Modal.Body>
      
    </Modal>
        
    );
};

export default LoginForm;