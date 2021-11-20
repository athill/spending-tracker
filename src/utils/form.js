import { Col, Form } from 'react-bootstrap';

export const FormField = ({ errors, label, name, register, required, ...atts }) => (
    <Col xs="auto">
      <Form.Group className="mb-2">
        <Form.Label htmlFor={name} visuallyHidden>{label}: </Form.Label>
        <Form.Control className="mb-2" placeholder={label} {...register(name, { required })} {...atts} />
        {errors[name] && <span>This field is required</span>}
      </Form.Group>
    </Col>
  );
