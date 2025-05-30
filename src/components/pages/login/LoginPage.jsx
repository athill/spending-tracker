import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { post } from '../../../utils/fetch'

const onSubmit = async (e, setError, navigate) => {
  setError(null);
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get("email");
  const password = formData.get("password");
  try {
  const response = await post("/api/auth/login", JSON.stringify({ email, password }));
  console.log("Login response:", response);
  localStorage.setItem("token", response.data.token.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  navigate("/");
 } catch (error) {
    setError(error.response.data.errors[0].message || "Login failed");
    localStorage.setItem("token", null);
    localStorage.setItem("user", null);
    return;
  }
};
const LoginPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  return (
    <div className="login-page">
      <h1>Login</h1>
      <Container>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            <Form onSubmit={(e) => onSubmit(e, setError, navigate)}>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control name="email" type="email" placeholder="Enter email" required />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" required />
              </Form.Group>
              <Button type="submit" variant="primary" className="mt-3">
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default LoginPage;
