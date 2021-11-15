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


const AddItemForm = ({ refreshData }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const onSubmit = data => {
    fetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.json())
    .then(json => {
      refreshData();
      ['quantity', 'item', 'price'].forEach(field => setValue(field, ''));
      console.log(json)
    });
  }; 

  return (
    <>
      <h2>Add Item</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="align-items-center">
          <FormField errors={errors} label="Date" name="date" defaultValue={new Date().toISOString().substring(0, 10)} register={register} required={true} type="date"  />
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

const DeleteForm = ({ id, refreshData }) => {
  const { handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (!window.confirm(`Delete ${id}?`)) {
      return;
    }
    fetch(`/api/transactions/${id}`, {
      method: "DELETE"
    })
    .then(response => response.json())
    .then(json => {
      refreshData();
      console.log(json)
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
          <Button type="submit">
            Delete
          </Button>      
    </Form>
  );
};

class App extends Component {
  state = {transactions: []};

  constructor(props) {
    super(props);
    this.getItems = this.getItems.bind(this);
  }

  componentDidMount() {
    this.getItems();
  }

  getItems() {
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
        <AddItemForm refreshData={this.getItems} />
        <h2>Transactions</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              {
                headers.map(header => <th key={`${header}`}>{header}</th>)
              }
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>  
            {
              this.state.transactions.map(transaction => (
                <tr key={transaction.id}>
                  {
                    headers.map(header => {
                      const field = header.toLowerCase();
                      let value = transaction[field];
                      if (field === 'date') {
                        value = value.substring(0, 10);
                      }
                      return <td key={`${transaction.id}-${header}}`}>{value}</td>
                    })
                  }
                  <td>
                    <DeleteForm id={transaction.id} refreshData={this.getItems} />
                  </td>
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
