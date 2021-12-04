import React from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import DateRangeForm from '../../DateRangeForm';
import { currencyFormat } from './../../../utils';


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

const TransactionTable = ({ addToast, refreshData, transactions}) => {
    const headers = ['Date', 'Store', 'Quantity', 'Item', 'Price', 'Category'];
    return (
        <>
            <h2>Transactions</h2>
            <DateRangeForm />
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
                transactions.map(transaction => (
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
                        <DeleteForm id={transaction.id} refreshData={refreshData}  addToast={addToast} />
                    </td>
                    </tr>
                ))
                }
            </tbody>
            </Table>
        </>
    )
}

export default TransactionTable;
