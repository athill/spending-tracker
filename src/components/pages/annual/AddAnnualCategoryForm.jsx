import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import { post } from '../../../utils/fetch';
import { FormField, annualCategoryFields } from '../../../utils/form';

const AddAnnualCategoryForm = ({ addToast, lists, refreshData }) => {
    const { register, handleSubmit, formState: { errors }, setFocus, setValue } = useForm();
    const onSubmit = async (data) => {
      await post('/api/annual_categories', JSON.stringify(data));
      refreshData();
      setValue('category', '');
      setValue('recurrence', 1);
      addToast(`${data.category} added`);
      setFocus('category');
    };
    return (
      <>
        <h2>Add Annual Category</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="align-items-center">
            {
              annualCategoryFields.map(field => <FormField key={field.name} errors={errors} {...field} lists={lists} register={register} />)
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

  export default AddAnnualCategoryForm;
