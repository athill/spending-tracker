import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const DeleteForm = ({ addToast, year, refreshData }) => {
  const { handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (!window.confirm(`Delete ${year}?`)) {
      return;
    }
    await fetch(`/api/taxes/${year}`, {
      method: "DELETE"
    });
    refreshData();
    addToast('Year deleted');
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
