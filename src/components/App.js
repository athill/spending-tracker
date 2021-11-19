import React, { Component, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table, Toast, ToastContainer } from 'react-bootstrap';
import Chart from "react-google-charts";
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
}

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

const CategoryChart = () => {
  const [data, setData] = useState();
  useEffect(() => {
    const getData = async () => {
      const response = await fetch('/api/search/categories');
      const json = await response.json();
      console.log({json});
      const results = [['Category', 'Total']];
      json.forEach(item => results.push([item.category, item.total]));
      console.log({results});
      setData(results);
    }
    getData();
  }, []);

  return  (       
  <Chart
    width={'500px'}
    height={'300px'}
    chartType="PieChart"
    loader={<div>Loading Chart</div>}
    data={data}
    options={{
      title: 'Spending by Category',
    }}
    rootProps={{ 'data-testid': '1' }}
  />);
};

class App extends Component {
  state = {
    transactions: [],
    toasts: []
  };


  constructor(props) {
    super(props);
    this.addToast = this.addToast.bind(this);
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
    const headers = ['Date', 'Store', 'Quantity', 'Item', 'Price', 'Category'];
    return (
      <div className="App">
        <CategoryChart />
        <AddItemForm refreshData={this.getItems} addToast={this.addToast} />

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
                    <DeleteForm id={transaction.id} refreshData={this.getItems}  addToast={this.addToast} />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </Table>
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{ minHeight: '240px', zIndex: 1000, position: 'fixed', top: '1em', right: '1em', width: '20em', color: 'white' }}
        >
          <ToastContainer position="top-end" className="p-3">
            { 
              this.state.toasts.map((Toaster, i) => <Toaster key={i} />) 
            }
          </ToastContainer>
        </div>        
      </div>
    );
  }
}

export default App;
