import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import { post } from '../../../utils/fetch';
import { FormField, annualFields } from '../../../utils/form';

const AddAnnualItemForm = ({ addToast, lists, refreshData }) => {
    const { register, handleSubmit, formState: { errors }, setFocus, setValue } = useForm();
    const onSubmit = async (data) => {
      await post('/api/annual', JSON.stringify(data));
      refreshData();
      const category = lists.categories.find(category => category.id === data.category_id);
      addToast(`${category} ${data.year} added`);
    };
    return (
      <>
        <h2>Add Item</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="align-items-center">
            {
              annualFields.map(field => <FormField key={field.name} errors={errors} {...field} lists={lists} register={register} />)
            }
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

  export default AddAnnualItemForm;
