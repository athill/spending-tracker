import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import { post } from '../../../utils/fetch';
import { FormField, taxesFields } from '../../../utils/form';

const AddYearForm = ({ addToast, refreshData }) => {
    const { register, handleSubmit, formState: { errors }, setFocus, setValue } = useForm();
    const onSubmit = async (data) => {
      await post('/api/taxes', JSON.stringify(data));
      refreshData();
      taxesFields.forEach(field => setValue(field.name, ''));
      addToast(`${data.year} added`);
      setFocus('year');
    };
    // year, ss_wages, ss_income, fed_withheld, fed_withheld, medicare_withheld, state_tax, local_tax
    return (
      <>
        <h2>Add Year</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="align-items-center">
            {
              taxesFields.map(field => <FormField key={field.name} errors={errors} {...field} register={register} />)
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

  export default AddYearForm;
