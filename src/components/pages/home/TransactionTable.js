import React, { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { FormField } from '../../../utils/form';

import DeleteForm from './DeleteForm';
import DateRangeForm from '../../DateRangeForm';
import PrimaryPagination from '../../PrimaryPagination';
import { currencyFormat } from './../../../utils';

const headers = ['Date', 'Store', 'Quantity', 'Item', 'Price', 'Category'];

const EditTransactionRow = ({ addToast, refreshData, setEditing, transaction }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
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
                const nonRequiredFields = ['quantity'];
                const required = !nonRequiredFields.includes(field);
                return <FormField key={field} errors={errors} label={field} name={field} defaultValue={value} register={register} required={required} type={type}  />
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

const Filter = ({ filter, setActivePage, setFilter }) => {
  const updateFilter = (text) => {
    setFilter(text);
    setActivePage(0);
  };

  return (
    <fieldset>
    <legend>Filter</legend>
    <InputGroup className="mb-1">
      <Form.Control value={filter} onChange={e => updateFilter(e.target.value)} />
      <Button onClick={() => updateFilter('')}>X</Button>
    </InputGroup>
  </fieldset>
  );
};

const ListCheckboxes = ({ list, name, register, title }) => (
  <fieldset className="bordered">
    <legend>{title}</legend>
    <Row>
    {
      list.map(item => (
        <Col key={item} xs={4} sm={3} md={2} lg={1}>
          <Form.Check label={item} {...register(name)} value={item} id={`${name}-${item}`} />
        </Col>))
    }
    </Row>
  </fieldset>
);

const Search = ({ lists, setSearch }) => {
  const [ show, setShow ] = useState(false);
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    setSearch(data);
  };
  return (
    <fieldset className="bordered">
      <legend><Button variant="light" size="lg" onClick={() => setShow(!show)}>Search {show && '^' || 'v'}</Button></legend>
      { show &&
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ListCheckboxes list={lists.categories} name="category" register={register} title="Categories" />
          <ListCheckboxes list={lists.stores} name="store" register={register} title="Stores" />
          <ListCheckboxes list={lists.items} name="item" register={register} title="Items" />
          <Button type="submit">Search</Button>
        </Form>
      }
  </fieldset>
  );
};

const TransactionTable = ({ addToast, editing, filter, lists, refreshData, setEditing, setFilter, setSearch, transactions}) => {
    const [ activePage, setActivePage ] = useState(0);

    const total = transactions.reduce((prev, curr) => prev + curr.price, 0);

    const pageSize = 50;
    const numPages = Math.ceil(transactions.length/pageSize);
    const startDisplay = pageSize * activePage;
    const Pagination = () => <PrimaryPagination numPages={numPages} active={activePage} setActive={setActivePage} />;
    return (
        <>
            <h2>Transactions</h2>
            <Row>
              <Col md={6}>
                <DateRangeForm />
              </Col>
              <Col xs={2}>
                <Filter filter={filter} setActivePage={setActivePage} setFilter={setFilter} />
              </Col>
            </Row>
            <Row>
              <Search lists={lists} setSearch={setSearch} />
            </Row>
            <strong>Total Items:</strong> {transactions.length}
            <Pagination />
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
                transactions.slice(startDisplay, Math.min(startDisplay + pageSize, transactions.length)).map((transaction, i) => (
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
            <Pagination />
        </>
    )
}

export default TransactionTable;
