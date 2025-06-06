import React, { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';

import DateRangeForm from '../../DateRangeForm';
import PrimaryPagination from '../../PrimaryPagination';
import { currencyFormat } from '../../../utils/index';


const updateSort = (field, setSort, sort) => {
    const dir = field === sort.field && sort.dir === 'asc' ? 'desc' : 'asc';
    setSort({field, dir });
};

const SortHeader = ({ children, field, setSort, sort  }) => (
    <th>{children} <Button onClick={() => updateSort(field, setSort, sort)}>{ sort.field === field ? sort.dir === 'asc' ? '^' : 'v': '-' }</Button></th>
);

const BankRow = ({ setSort, sort, transaction: { transactionNumber, date, description, memo, debit, credit, balance, check_number, fees } }) => {
    return (
        <tr>
            <td>{transactionNumber}</td>
            <td>{new Date(date).toLocaleDateString()}</td>
            <td>{description}</td>
            <td>{memo}</td>
            <td>{debit}</td>
            <td>{credit}</td>
            <td>{currencyFormat(balance)}</td>
            <td>{check_number}</td>
            <td>{fees}</td>
        </tr>
    )
};


const Filter = ({ filter, setActivePage, setFilter, setSort, sort }) => {
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

const BankTable = ({ filter, setFilter, setSort, data, sort }) => {
    const [ activePage, setActivePage ] = useState(0);

    const pageSize = 50;
    const numPages = Math.ceil(data.length/pageSize);
    const startDisplay = pageSize * activePage;
    console.log({data})

    const Pagination = () => <PrimaryPagination numPages={numPages} active={activePage} setActive={setActivePage} />;
    const Header = ({ children, field }) => <SortHeader field={field} sort={sort} setSort={setSort}>{children}</SortHeader>
      return (
          <>
              <h2>Price Per Unit</h2>
              <Row>
                <Col md={6}>
                  <DateRangeForm />
                </Col>
                <Col xs={2}>
                  <Filter filter={filter} setActivePage={setActivePage} setFilter={setFilter} />
                </Col>
              </Row>

              <strong>Total Items:</strong> {data.length}
              <Pagination />
              <Table striped bordered hover>
              <thead>
                  <tr>
                    <Header field="tranascation_number">Transaction #</Header>
                    <Header field="date">Date</Header>
                    <Header field="description">Description</Header>
                    <Header field="memo">Memo</Header>
                    <Header field="debit">Debit</Header>
                    <Header field="credit">Credit</Header>
                    <Header field="balance">Balnace</Header>
                    <Header field="check_number">Check #</Header>
                    <Header field="fees">Fees</Header>
                  </tr>
              </thead>
              <tbody>
                {
                  data.slice(startDisplay, Math.min(startDisplay + pageSize, data.length)).map((transaction, i) => (
                      <BankRow
                        key={i}
                        transaction={transaction}
                        />
                  ))
                }
              </tbody>
              </Table>
              <Pagination />
          </>
      )
  }

  export default BankTable;
