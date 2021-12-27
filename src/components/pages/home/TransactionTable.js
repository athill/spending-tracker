import React from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { FormField } from '../../../utils/form';

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
      <Form onSubmit={handleSubmit(onSubmit)} style={{display: 'inline'}}>
            <Button type="submit">
              Delete
            </Button>
      </Form>
    );
  };

const EditTransactionRow = ({ addToast, refreshData, setEditing, transaction }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const onSubmit = id => data => {
    fetch(`/api/transactions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(() => {
      refreshData();
      setEditing(false);
      addToast(`${data.item} updated`);
    });
  };
  return (
    <tr>
      <td colSpan={headers.length + 1}>
        <form onSubmit={handleSubmit(onSubmit(transaction.id))}>
          <Row className="align-items-center">
            {
              headers.map(header => {
                const field = header.toLowerCase();
                let value = transaction[field];
                let type = field === 'date' ? 'date' : null;
                if (field === 'date') {
                  value =  new Date(value).toISOString().substring(0, 10);
                }
                return <FormField key={field} errors={errors} label={field} name={field} defaultValue={value} register={register} required={true} type={type}  />
              })
            }
            <Col xs="auto">
              <Button type="submit">Update</Button>{' '}
              <Button onClick={() => setEditing(null)}>Cancel</Button>
            </Col>
          </Row>
        </form>
      </td>
    </tr>
  );
};

const TransactionRow = ({ addToast, editing, refreshData, setEditing, transaction }) => {
  if (editing) {
    return <EditTransactionRow addToast={addToast} refreshData={refreshData} setEditing={setEditing} transaction={transaction} />
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
          <Button onClick={() => setEditing(transaction.id)}>Edit</Button>&nbsp;<DeleteForm id={transaction.id} refreshData={refreshData}  addToast={addToast} />
      </td>
    </tr>
  );
};

const TransactionTable = ({ addToast, editing, refreshData, setEditing, setFilter, transactions}) => {

    const total = transactions.reduce((prev, curr) => prev + curr.price, 0);

    return (
        <>
            <h2>Transactions</h2>
            <Row>
              <Col>
                <DateRangeForm />
              </Col>
              <Col>
                  <fieldset><legend>Filter</legend> <input type="text" onChange={event => setFilter(event.target.value)} /></fieldset>
              </Col>
            </Row>
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
                      editing={editing === transaction.id}
                      refreshData={refreshData}
                      setEditing={setEditing}
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
