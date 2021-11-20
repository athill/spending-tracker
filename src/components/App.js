import React, { Component, useEffect, useState } from 'react';
import { Container, Nav, Navbar, Toast, ToastContainer } from 'react-bootstrap';
import { Routes, Route } from "react-router-dom";

import HomePage from './pages/home/HomePage';
import DashboardPage from './pages/dashboard/DashboardPage';

import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => (
    <Navbar bg="light" expand="lg">
    <Container>
        <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
        </Nav>
        </Navbar.Collapse>
    </Container>
    </Navbar>
);

const Toasts = ({ toasts }) => (
    <div
    aria-live="polite"
    aria-atomic="true"
    style={{ minHeight: '240px', zIndex: 1000, position: 'fixed', top: '1em', right: '1em', width: '20em', color: 'white' }}
  >
    <ToastContainer position="top-end" className="p-3">
      {
        toasts.map((Toaster, i) => <Toaster key={i} />)
      }
    </ToastContainer>
  </div>
);

class App extends Component {
  state = {
    toasts: []
  };

  constructor(props) {
    super(props);
    this.addToast = this.addToast.bind(this);
  }

  addToast(content) {
    this.setState({
      toasts: this.state.toasts.concat(() => {
        const [show, setShow] = useState(true);
        return (
          <Toast onClose={() => setShow(false)} show={show} autohide delay={1000} bg="secondary">
            <Toast.Body>{content}</Toast.Body>
          </Toast>
        );
      }

      )
    });
  }

  render() {
    return (
    <div className="App">
        <Header />
        <Routes>
            <Route path="/" element={<HomePage addToast={this.addToast}  />} />
            <Route path="dashboard" element={<DashboardPage />} />
       </Routes>
        <Toasts toasts={this.state.toasts} />

    </div>
    );
  }
}

export default App;
