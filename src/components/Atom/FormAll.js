import { FloatingLabel, Form } from "react-bootstrap";

const FormAll = ({ label, type, placeholder, custom, id, name, ...rest }) => {
  return (
    <Form.Group className="mb-3" >
      <FloatingLabel label={label}>
        <Form.Control 
        type={!type ? "text" : type}
        placeholder={placeholder}
        id={id}
        name={name}
        {...rest}>          
        </Form.Control>
      </FloatingLabel>
    </Form.Group>
  );
};

export default FormAll;