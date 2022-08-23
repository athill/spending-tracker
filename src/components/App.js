import React, { Component, useState } from 'react';
import { Container, Nav, Navbar, Toast, ToastContainer } from 'react-bootstrap';
import { Routes, Route, useSearchParams } from "react-router-dom";

import BankPage from './pages/bank/BankPage';
import HomePage from './pages/home/HomePage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PaychecksPage from './pages/paychecks/PaychecksPage';
import PricePerUnitPage from './pages/ppu/PricePerUnitPage';
import { NavLink } from '../utils';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const Header = () => {
  const [ searchParams ] = useSearchParams();
  const search = searchParams ? `?${searchParams.toString()}` : '';
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
    <Container>
        <Navbar.Brand href="/">Spending Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
            <NavLink href={`/${search}`}>Home</NavLink>
            <NavLink href={`/dashboard${search}`}>Dashboard</NavLink>
            <NavLink href='/paychecks'>Paychecks</NavLink>
            <NavLink href='/ppu'>Price Per Unit</NavLink>
            <NavLink href='/bank'>Bank</NavLink>
        </Nav>
        </Navbar.Collapse>
    </Container>
    </Navbar>
  );
};

const Toasts = ({ toasts }) => (
    <div
    aria-live="polite"
    aria-atomic="true"
    style={{ minHeight: '40px', zIndex: 1000, position: 'fixed', top: '1em', right: '1em', width: '20em', color: 'white' }}
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
            <Route path="/paychecks" element={<PaychecksPage />} />
            <Route path="/ppu" element={<PricePerUnitPage />} />
            <Route path="/bank" element={<BankPage />} />
        </Routes>
        <Toasts toasts={this.state.toasts} />
      </div>
    );
  }
}

export default App;
