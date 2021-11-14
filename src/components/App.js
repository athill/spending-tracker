import React, { Component } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import 'bootstrap/dist/css/bootstrap.min.css';

const FormField = ({ errors, label, name, register, required, ...atts }) => (
  <Col xs="auto">
    <Form.Group className="mb-2">
      <Form.Label htmlFor={name} visuallyHidden>{label}: </Form.Label>
      <Form.Control className="mb-2" placeholder={label} {...register(name, { required })} {...atts} />
      {errors[name] && <span>This field is required</span>}
    </Form.Group>
  </Col>
);


const AddItemForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => {
    fetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then(json => console.log(json));
  }; 
// tr_date	store	quantity	item	price	category

  return (
    <>
      <h2>Add Item</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="align-items-center">
          <FormField errors={errors} label="Date" name="date" register={register} required={true} type="date"  />
          <FormField errors={errors} label="Store" name="store" register={register} required={true}  />
          <FormField errors={errors} label="Quantity" name="quantity" register={register}  />
          <FormField errors={errors} label="Item" name="item" register={register} required={true}  />
          <FormField errors={errors} label="Price" name="price" register={register} required={true}  />
          <FormField errors={errors} label="Category" name="category" register={register} required={true}  />
          <Col xs="auto">
          <Button type="submit" className="mb-1">
            Add
          </Button>
        </Col>
        </Row>
      </Form>
    </>
  );
}

class App extends Component {
  state = {transactions: []};

  componentDidMount() {
    fetch('/api')
      .then(res => res.json())
      .then(response => {
        this.setState({ transactions: response });
      });
  }

  render() {
    const headers = ['Date', 'Store', 'Quantity', 'Item', 'Price', 'Category'];
    return (
      <div className="App">
        <AddItemForm />
        <h2>Transactions</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              {
                headers.map(header => <th key={`${header}`}>{header}</th>)
              }
            </tr>
          </thead>
          <tbody>  
            {
              this.state.transactions.map(transaction => (
                <tr key={transaction.id}>
                  {
                    headers.map(header => <td key={`${transaction.id}-${header}}`}>{transaction[header.toLowerCase()]}</td>)
                  }
                </tr>
              ))
            }
        </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
