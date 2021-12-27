import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import { FormField } from '../../../utils/form';

const AddItemForm = ({ addToast, refreshData }) => {
    const { register, handleSubmit, formState: { errors }, setFocus, setValue } = useForm();
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
        setFocus('quantity');
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
                lists.stores.map(store => <option key={store}>{store}</option>)
              }
            </datalist>
            <FormField errors={errors} label="Quantity" name="quantity" register={register}  />
            <FormField errors={errors} label="Item" name="item" register={register} required={true} list="items" />
            <datalist id="items">
              {
                lists.items.map(item => <option key={item}>{item}</option>)
              }
            </datalist>
            <FormField errors={errors} label="Price" name="price" register={register} required={true}  />
            <FormField errors={errors} label="Category" name="category" register={register} required={true} list="categories"  />
            <datalist id="categories">
              {
                lists.categories.map(category => <option key={category}>{category}</option>)
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

  export default AddItemForm;
