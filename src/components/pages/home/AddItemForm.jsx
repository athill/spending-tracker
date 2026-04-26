import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import { post } from '../../../utils/fetch';
import { FormField, getTransactionField } from '../../../utils/form';

const AddItemForm = ({ addToast, lists, refreshData }) => {
    const { register, handleSubmit, formState: { errors }, setFocus, setValue } = useForm();
    const onSubmit = async (data) => {
      await post('/api/transactions', JSON.stringify(data));
      refreshData();
      ['quantity', 'item', 'price'].forEach(field => setValue(field, ''));
      addToast(`${data.item} added`);
      setFocus('quantity');
    };
    const dateField = {...getTransactionField('date')};
    dateField.defaultValue = dateField.value();
    delete dateField.value;
    return (
      <>
        <h2>Add Item</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="align-items-center">
            <FormField errors={errors} {...dateField} register={register}   />
            <FormField errors={errors} {...getTransactionField('store')} lists={lists} register={register} />
            <FormField errors={errors} {...getTransactionField('quantity')} register={register} />
            <FormField errors={errors} {...getTransactionField('item')} lists={lists} register={register} />
            <FormField errors={errors} {...getTransactionField('price')} register={register} />
            <FormField errors={errors} {...getTransactionField('category')} lists={lists} register={register} />
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
