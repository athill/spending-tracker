import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import AddItemForm from './AddItemForm';
import TransactionTable from './TransactionTable';
import { get } from '../../../utils/fetch';

const filterTransactions = (transactions, filter) => {
  if (!filter) {
    return transactions;
  }
  const upperCaseFilter = filter.toUpperCase();
  return transactions.filter(transaction => {
    return transaction.store.toUpperCase().includes(upperCaseFilter)
      || transaction.item.toUpperCase().includes(upperCaseFilter)
      || transaction.category.toUpperCase().includes(upperCaseFilter);
  });
}

const HomePage = ({ addToast }) => {
  const [ editing, setEditing ] = useState(null);
  const [ transactions, setTransactions ] = useState([]);
  const [ filter, setFilter ] = useState('');
  const [ searchParams ] = useSearchParams();

  const fetchData = useCallback(async () => {
    let url = '/api';
    if (searchParams.toString()) {
      url += '?' + searchParams.toString();
    }
    const transactions = await get(url);
    setTransactions(transactions);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // searchParams, fetchData

  return (
       <div className="App">
        <AddItemForm refreshData={fetchData} addToast={addToast} />
        <TransactionTable
          addToast={addToast}
          refreshData={fetchData}
          editing={editing}
          setEditing={setEditing}
          setFilter={setFilter}
          transactions={filterTransactions(transactions, filter)} />
      </div>
  )

}

export default HomePage;
