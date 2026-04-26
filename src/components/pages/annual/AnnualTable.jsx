import React from "react";

import { Table } from 'react-bootstrap';

import { currencyFormat, monthMap } from '../../../utils'

const AnnualTable = ({ data, years }) => {
  if (!data.categories) {
    return <></>;
  }
  const totals = {};
  const categories = [...data.categories];
  data.items.forEach(item => {
    const category = categories.find(category => category.category === item.category);
    if (!('years' in category)) {
      category.years = {};
    }
    category.years[item.year] = item.amount;
    // totals
    if (!(item.year in totals)) {
      totals[item.year] = {
        year: 0
      };
    }
    totals[item.year].year += item.amount;
    if (!(item.month in totals[item.year])) {
      totals[item.year][item.month] = 0;
    }
    totals[item.year][item.month] += item.amount;
  });
  console.log(totals);
  return (
    <Table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Month</th>
          {
            years.map(year => <th key={year}>{year}</th>)
          }
        </tr>
      </thead>
      <tbody>
        {
          categories.map(category => (
            <tr key={category.category}>
              <td>{category.category}</td>
              <td>{ monthMap[category.month] }</td>
              {
                years.map(year => <td key={`${category.category}-${year}`}>{ 'years' in category && year in category.years ? currencyFormat(category.years[year]) : '' }</td>)
              }
            </tr>
          ))
        }
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">Total: </th>
          <td>&nbsp;</td>
          {
            years.map(year => (
              <td key={year}>{year in totals ? currencyFormat(totals[year].year) : null}</td>
            ))
          }
        </tr>
        {
          Object.keys(monthMap).map(monthInt => (
            <tr key={monthInt}>
              <th scope="row">{monthMap[monthInt]} Total</th>
              <td>&nbsp;</td>
              {
                years.map(year => (
                  <td key={year}>{year in totals && monthInt in totals[year] ? currencyFormat(totals[year][monthInt]) : null}</td>
                ))
              }
            </tr>
          ))
        }
      </tfoot>
    </Table>
  )
};

export default AnnualTable;
