import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { get } from '../../../utils/fetch';
import BankTable from './BankTable';


const filterTransactions = (transactions, filter, sort) => {
  let filteredTransactions = [...transactions];
  if (filter) {
    const upperCaseFilter = filter.toUpperCase();
    filteredTransactions = transactions.filter(({ description, memo }) => {
      return  description.toUpperCase().includes(upperCaseFilter)
        || memo.toUpperCase().includes(upperCaseFilter);
    });
  }
  filteredTransactions.sort((a, b) => {
    const field = sort.field;
    let first = a[field];
    let last = b[field];
    if (sort.dir === 'desc') {
      first = b[field];
      last = a[field];
    }
    if (['debit', 'credit', 'balance', 'fees', 'check_number'].includes(field)) {
      first = Number.parseFloat(first);
      last = Number.parseFloat(last);
      if (isNaN(first)) {
        first = 0;
      }
      if (isNaN(last)) {
        last = 0;
      }
    }
    if (first < last) {
      return -1
    } else if (first > last) {
      return 1;
    }
    return 0;
  });
  return filteredTransactions;

}

const BankPage = () => {
  const [ searchParams ] = useSearchParams();
  const [transactions, setTransactions] = useState([]);
  const [ filter, setFilter ] = useState('');
  const [ sort, setSort] = useState({ field: 'date', dir: 'desc' });
  const fetchData = useCallback(async () => {
    let url = '/api/bank';
    if (searchParams.toString()) {
      url += '?' + searchParams.toString();
    }
    const result = await(get(url));
    setTransactions(result);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); 
  return <BankTable data={filterTransactions(transactions, filter, sort)} filter={filter} sort={sort} setSort={setSort} setFilter={setFilter} />

}

export default BankPage;
