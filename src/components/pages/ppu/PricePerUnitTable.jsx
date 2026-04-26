import React, { useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap';
import Chart from "react-google-charts";

import DateRangeForm from '../../DateRangeForm';
import PrimaryPagination from '../../PrimaryPagination';
import { currencyFormat } from '../../../utils/index';



const PricePerUnitRow = ({ category, item, purchases }) => {
    const data = [[ 
        { type: 'date', label: 'Date' }, 
        { type: 'number', label: 'Price Per Unit' },
        {type: 'string', role: 'tooltip'}
    ]];

    const tooltip = purchase => {
        const toolTipLines = [
            new Date(purchase.date).toLocaleDateString(),
            `${Number.parseFloat(purchase.ppu).toFixed(4)}/${purchase.unit}`,
            `${purchase.quantity} ${currencyFormat(purchase.price)}`,
            purchase.store
        ];        
        return toolTipLines.join('\n');
    };
    purchases.forEach(purchase => data.push([new Date(purchase.date), purchase.ppu, tooltip(purchase)]));
    const options = {
        pointSize: 10,
        tooltip: {isHtml: true},
    };
    return (
        <tr>
            <th>{category}</th>
            <th>{item}</th>
            <td>
            <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
                />
            </td>
        </tr>
    )
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
  
const PricePerUnitTable = ({ filter, setFilter, data }) => {
    const [ activePage, setActivePage ] = useState(0);
  
  
    const pageSize = 50;
    const numPages = Math.ceil(data.length/pageSize);
    const startDisplay = pageSize * activePage;
    
    const Pagination = () => <PrimaryPagination numPages={numPages} active={activePage} setActive={setActivePage} />;
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
                    <th>Category</th>
                    <th>Item</th>
                    <th>Purchases</th>
                  </tr>
              </thead>
              <tbody>
                {
                  data.slice(startDisplay, Math.min(startDisplay + pageSize, data.length)).map(({ category, item, purchases }, i) => (
                      <PricePerUnitRow
                        key={i}
                        category={category}
                        item={item}
                        purchases={purchases}
                        />
                  ))
                }
              </tbody>
              </Table>
              <Pagination />
          </>
      )
  }
  
  export default PricePerUnitTable;