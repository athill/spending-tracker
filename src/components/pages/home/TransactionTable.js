import React from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import DateRangeForm from '../../DateRangeForm';
import { currencyFormat } from './../../../utils';

const headers = ['Date', 'Store', 'Quantity', 'Item', 'Price', 'Category'];

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

  const TransactionRow = ({ addToast, editing=false, refreshData, transaction }) => {
    if (editing) {
      return (
        <tr>
          <td colSpan={headers.length + 1}>
            <form>
              <Table>
                <tbody>
                    <tr>
                      {
                        headers.map(header => {
                          const field = header.toLowerCase();
                          let value = transaction[field];
                          let type = field === 'date' ? 'date' : null;
                          return <td><input value={value} type={type} /></td>
                        })
                      }
                      <td>
                        <Button>Update</Button>{' '}
                        <Button>Cancel</Button>
                      </td>
                    </tr>
                </tbody>
              </Table>
            </form>
          </td>
        </tr>
      )
    }
    return (
      <tr>
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
    );
  };

const TransactionTable = ({ addToast, refreshData, transactions}) => {

    const total = transactions.reduce((prev, curr) => prev + curr.price, 0);

    return (
        <>
            <h2>Transactions</h2>
            <DateRangeForm />
            <strong>Total Items:</strong> {transactions.length}
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
                transactions.map((transaction, i) => (
                    <TransactionRow
                      key={transaction.id}
                      addToast={addToast}
                      refreshData={refreshData}
                      transaction={transaction} />
                ))
              }
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={headers.indexOf('Price')}>Total</th>
                <td>{currencyFormat(total)}</td>
              </tr>
            </tfoot>
            </Table>
        </>
    )
}

export default TransactionTable;
