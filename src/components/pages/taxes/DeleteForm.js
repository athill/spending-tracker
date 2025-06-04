import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import { del } from '../../../utils/fetch';

const DeleteForm = ({ addToast, year, refreshData }) => {
  const { handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (!window.confirm(`Delete ${year}?`)) {
      return;
    }
    await del(`/api/taxes/${year}`);
    refreshData();
    addToast('Year deleted ', year);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} style={{display: 'inline'}}>
          <Button type="submit">
            Delete
          </Button>
    </Form>
  );
};

export default DeleteForm;
