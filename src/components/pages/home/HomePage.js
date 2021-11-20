import React, { Component, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table, Toast } from 'react-bootstrap';
import { useForm } from "react-hook-form";

const FormField = ({ errors, label, name, register, required, ...atts }) => (
  <Col xs="auto">
    <Form.Group className="mb-2">
      <Form.Label htmlFor={name} visuallyHidden>{label}: </Form.Label>
      <Form.Control className="mb-2" placeholder={label} {...register(name, { required })} {...atts} />
      {errors[name] && <span>This field is required</span>}
    </Form.Group>
  </Col>
);

const currencyFormat = (value) => {
    return new Intl.NumberFormat(`en-US`, {
        currency: `USD`,
        style: 'currency',
    }).format(value);
};



const AddItemForm = ({ addToast, refreshData }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [lists, setLists] = useState({ categories: [], items: [], stores: [] });
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/lists');
      const lists = await response.json();
      setLists(lists);
    }
    fetchData();
  }, []);
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
      addToast(`${data.item} added`);
      console.log(json)
    });
  };

  return (
    <>
      <h2>Add Item</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="align-items-center">
          <FormField errors={errors} label="Date" name="date" defaultValue={new Date().toISOString().substring(0, 10)} register={register} required={true} type="date"  />
          <FormField errors={errors} label="Store" name="store" register={register} required={true} list="stores" />
          <datalist id="stores">
            {
              lists.stores.map(store => <option>{store}</option>)
            }
          </datalist>
          <FormField errors={errors} label="Quantity" name="quantity" register={register}  />
          <FormField errors={errors} label="Item" name="item" register={register} required={true} list="items" />
          <datalist id="items">
            {
              lists.items.map(item => <option>{item}</option>)
            }
          </datalist>
          <FormField errors={errors} label="Price" name="price" register={register} required={true}  />
          <FormField errors={errors} label="Category" name="category" register={register} required={true} list="categories"  />
          <datalist id="categories">
            {
              lists.categories.map(category => <option>{category}</option>)
            }
          </datalist>
          <Col xs="auto">
            <Button type="submit" className="mb-1">
              Add
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

const DeleteForm = ({ addToast, id, refreshData }) => {
  const { handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (!window.confirm(`Delete ${id}?`)) {
      return;
    }
    fetch(`/api/transactions/${id}`, {
      method: "DELETE"
    })
    .then(response => {
      refreshData();
      addToast('Item deleted');
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

class HomePage extends Component {
  state = {
    transactions: [],
    toasts: []
  };


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
        <AddItemForm refreshData={this.getItems} addToast={this.props.addToast} />

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
                        value = new Date(value.substring(0, 10)).toLocaleDateString();
                      } else if (field === 'price') {
                          value = currencyFormat(value);
                      }
                      return <td key={`${transaction.id}-${header}}`}>{value}</td>
                    })
                  }
                  <td>
                    <DeleteForm id={transaction.id} refreshData={this.getItems}  addToast={this.props.addToast} />
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

export default HomePage;
