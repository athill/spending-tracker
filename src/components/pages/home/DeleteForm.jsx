import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const DeleteForm = ({ addToast, id, refreshData }) => {
  const { handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (!window.confirm(`Delete ${id}?`)) {
      return;
    }
    await fetch(`/api/transactions/${id}`, {
      method: "DELETE"
    });
    refreshData();
    addToast('Item deleted');
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
