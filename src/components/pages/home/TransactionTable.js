import React, { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import { FormField, transactionFields } from '../../../utils/form';
import DeleteForm from './DeleteForm';
import DateRangeForm from '../../DateRangeForm';
import { getPagination } from '../../PrimaryPagination';
import { currencyFormat } from './../../../utils';
import { patch } from '../../../utils/fetch';

const headers = ['Date', 'Store', 'Quantity', 'Item', 'Price', 'Category'];

const EditTransactionRow = ({ addToast, lists, refreshData, setEditing, transaction }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = id => async data => {
    await patch(`/api/transactions/${id}`, data)
    refreshData();
    setEditing(false);
    addToast(`${data.item} updated`);
  };

  return (
    <tr>
      <td colSpan={transactionFields.length + 1}>
        <form onSubmit={handleSubmit(onSubmit(transaction.id))}>
          <Row className="align-items-center">
            {
              transactionFields.map(field => {
                const f = {...field};
                f.defaultValue = field.value ? field.value(transaction[f.name]) : transaction[f.name];
                delete f.value;
                return <FormField
                    key={f.name}
                    errors={errors}
                    lists={lists}
                    {...f}
                    register={register}
                  />
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

const TransactionRow = ({ addToast, editing, lists, refreshData, setEditing, transaction }) => {
  if (editing) {
    return <EditTransactionRow
        addToast={addToast}
        lists={lists}
        refreshData={refreshData}
        setEditing={setEditing}
        transaction={transaction}
      />
  }
  return (
    <tr>
      {
          transactionFields.map(field => {
              let value = field.display ? field.display(transaction[field.name]) : transaction[field.name];
              return <td key={`${transaction.id}-${field.label}}`}>{value}</td>
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

const ListCheckboxes = ({ list, name, register, title, Toggler }) => (
  <Toggler code={name} label={title}>
    <Row>
    {
      list.map(item => (
        <Col key={item} xs={4} sm={3} md={2} lg={1}>
          <Form.Check label={item} {...register(name)} value={item} id={`${name}-${item}`} />
        </Col>))
    }
    </Row>
    </Toggler>
);

const CostField = ({ name, label, register }) => (
  <Form.Group className="mb-2">
  <Form.Label htmlFor={name}>{label}: </Form.Label>
  <Form.Control className="mb-2" type="number" step=".01" {...register(name)} />
</Form.Group>
);

const toggleFieldsetTemplate = (show, setShow) => ({label, code, children})  => {
  const onClick = () => setShow({
    ...show,
    [code]: !show[code]
  });
  return (
    <fieldset className="bordered">
    <legend>
      <Button variant="light" size="lg" onClick={onClick}>{label} {show[code] ? '^' : 'v'}</Button>
    </legend>
    { show[code] &&
      children
    }
    </fieldset>
  );
};

const Search = ({ lists, setSearch }) => {
  const [ show, setShow ] = useState({
    parent: false,
    category: false,
    stores: false,
    item: false
  });
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    setSearch(data);
  };
  const ToggleFieldset = toggleFieldsetTemplate(show, setShow);
  return (
    <ToggleFieldset label="Search" code="parent">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="bordered">
            <legend>Price</legend>
            <Row>
            <Col md={2}>
              <CostField name="lb" label="Lower Bound" register={register}/>
            </Col>
            <Col md={2}>
            <CostField name="ub" label="Upper Bound" register={register} />
            </Col>
            </Row>
          </fieldset>
          <ListCheckboxes Toggler={ToggleFieldset} list={lists.categories} name="category" register={register} title="Categories" />
          <ListCheckboxes Toggler={ToggleFieldset} list={lists.stores} name="store" register={register} title="Stores" />
          <ListCheckboxes Toggler={ToggleFieldset} list={lists.items} name="item" register={register} title="Items" />
          <Button type="submit">Search</Button>
        </Form>
      </ToggleFieldset>
  );
};

const TransactionTable = ({ addToast, editing, filter, lists, refreshData, setEditing, setFilter, setSearch, transactions}) => {
    const [ activePage, setActivePage ] = useState(0);

    const total = transactions.reduce((prev, curr) => prev + parseFloat(curr.price), 0);

    const pageSize = 50;
    const { Pagination, slice } = getPagination({activePage, items: transactions, pageSize, setActivePage});
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
                    transactionFields.map(({label}) => <th key={`${label}`}>{label}</th>)
                }
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
              {
                slice(transactions).map((transaction, i) => (
                    <TransactionRow
                      key={transaction.id}
                      addToast={addToast}
                      editing={editing === transaction.id}
                      lists={lists}
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
